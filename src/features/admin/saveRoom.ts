import { addHotspot, createRoom, deleteHotspot, updateHotspot, updateRoom } from "../../api/rooms";
import type { AdminRoom } from "../../api/rooms";
import { toContentPayload, toHotspotFormValues, toRoomPayload } from "./mappers";
import type { RoomFormValues } from "./mappers";

const CLEARED = { prerequisiteId: null, lockedMessage: null, isFinal: false };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Saves the whole form to the server, which only has per-hotspot endpoints and re-validates the
 * whole dependency graph after every call. So the order matters:
 *   1. clear dependencies / final flag of everything that changes (and of removed points)
 *   2. delete removed points
 *   3. create new points (no dependencies yet)
 *   4. update changed content
 *   5. set dependencies
 *   6. set the final flag last (a room is playable only when it has a final puzzle)
 * Only what actually changed is sent, because every hotspot change resets players' progress.
 * Returns the room id.
 */
export async function saveRoom(original: AdminRoom | null, values: RoomFormValues) {
  const roomPayload = toRoomPayload(values);

  let roomId: string;
  if (original) {
    roomId = original.id;
    const current = toRoomPayload({ ...original, imageKey: original.imageKey ?? "", hotspots: [] });
    const changes = Object.fromEntries(
      Object.entries(roomPayload).filter(
        ([key, value]) => !same(value, current[key as keyof typeof current]),
      ),
    );
    if (Object.keys(changes).length > 0) await updateRoom(roomId, changes);
  } else {
    roomId = (await createRoom(roomPayload)).room.id;
  }

  const existing = new Map((original?.hotspots ?? []).map((h) => [h.id, h]));
  const wanted = values.hotspots;
  const wantedIds = new Set(wanted.map((h) => h.id));
  const removed = [...existing.values()].filter((h) => !wantedIds.has(h.id));
  const kept = wanted.filter((h) => existing.has(h.id));
  const added = wanted.filter((h) => !existing.has(h.id));

  // What the server will hold for each point: tracked so we only send real differences.
  const state = new Map(
    [...existing.values()].map((h) => [
      h.id,
      { prerequisiteId: h.prerequisiteId, lockedMessage: h.lockedMessage, isFinal: h.isFinal },
    ]),
  );

  // The form gives new points a temporary id; the server assigns the real one.
  const serverId = new Map(wanted.map((h) => [h.id, h.id]));
  const prerequisiteOf = (h: (typeof wanted)[number]) =>
    h.type === "PUZZLE" && h.prerequisiteId ? serverId.get(h.prerequisiteId)! : null;
  const lockedMessageOf = (h: (typeof wanted)[number]) =>
    prerequisiteOf(h) ? h.lockedMessage.trim() : null;
  const isFinalOf = (h: (typeof wanted)[number]) => h.type === "PUZZLE" && h.isFinal;

  // 1. clear
  for (const h of removed) {
    const s = state.get(h.id)!;
    if (s.prerequisiteId || s.isFinal) await updateHotspot(h.id, CLEARED);
  }
  for (const h of kept) {
    const s = state.get(h.id)!;
    const differs = s.prerequisiteId !== prerequisiteOf(h) || s.isFinal !== isFinalOf(h);
    if (differs && (s.prerequisiteId || s.lockedMessage || s.isFinal)) {
      await updateHotspot(h.id, CLEARED);
      state.set(h.id, { ...CLEARED });
    }
  }

  // 2. delete
  for (const h of removed) await deleteHotspot(h.id);

  // 3. create
  for (const h of added) {
    const { hotspot } = await addHotspot(roomId, {
      ...toContentPayload(h),
      ...CLEARED,
    });
    serverId.set(h.id, hotspot.id);
    state.set(hotspot.id, { ...CLEARED });
  }

  // 4. content
  for (const h of kept) {
    const before = toContentPayload(toHotspotFormValues(existing.get(h.id)!));
    const after = toContentPayload(h);
    if (!same(before, after)) await updateHotspot(h.id, after);
  }

  // 5. dependencies
  for (const h of wanted) {
    const id = serverId.get(h.id)!;
    const prerequisiteId = prerequisiteOf(h);
    const lockedMessage = lockedMessageOf(h);
    const s = state.get(id)!;
    if (
      prerequisiteId &&
      (s.prerequisiteId !== prerequisiteId || s.lockedMessage !== lockedMessage)
    ) {
      await updateHotspot(id, { prerequisiteId, lockedMessage });
      state.set(id, { ...s, prerequisiteId, lockedMessage });
    }
  }

  // 6. final flag
  for (const h of wanted) {
    const id = serverId.get(h.id)!;
    if (isFinalOf(h) && !state.get(id)!.isFinal) await updateHotspot(id, { isFinal: true });
  }

  return roomId;
}
