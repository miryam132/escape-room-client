import { rooms } from "./rooms";
import { hotspots } from "./hotspot";
import type { Hotspot } from "../types/hotspot";
import type { EscapeRoom } from "../types/escapeRoom";

type Room = EscapeRoom;

export type RoomInput = Omit<Room, "id" | "createdAt">;

export type HotspotInput = Hotspot extends infer H
  ? H extends Hotspot
    ? Omit<H, "roomId">
    : never
  : never;

export async function getRooms() {
  return [...rooms];
}

export async function getRoomById(id: string) {
  return rooms.find((room) => room.id === id) ?? null;
}

export async function getHotspotsByRoomId(roomId: string) {
  return hotspots.filter((hotspot) => hotspot.roomId === roomId);
}

export async function createRoom(roomData: RoomInput, roomHotspots: HotspotInput[]) {
  const room: Room = {
    ...roomData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const newHotspots: Hotspot[] = roomHotspots.map((hotspot) => ({
    ...hotspot,
    roomId: room.id,
  }));

  rooms.push(room);
  hotspots.push(...newHotspots);

  return room;
}

export async function updateRoom(id: string, roomData: RoomInput, roomHotspots: HotspotInput[]) {
  const index = findRoomIndex(id);

  const updatedRoom: Room = {
    ...rooms[index],
    ...roomData,
    id: rooms[index].id,
    createdAt: rooms[index].createdAt,
  };

  const updatedHotspots: Hotspot[] = roomHotspots.map((hotspot) => ({
    ...hotspot,
    roomId: id,
  }));

  rooms[index] = updatedRoom;

  removeRoomHotspots(id);
  hotspots.push(...updatedHotspots);

  return updatedRoom;
}

export async function deleteRoom(id: string) {
  const index = findRoomIndex(id);

  rooms.splice(index, 1);
  removeRoomHotspots(id);
}

function findRoomIndex(id: string) {
  const index = rooms.findIndex((room) => room.id === id);
  if (index === -1) throw new Error("החדר לא נמצא");
  return index;
}

function removeRoomHotspots(roomId: string) {
  for (let index = hotspots.length - 1; index >= 0; index--) {
    if (hotspots[index].roomId === roomId) hotspots.splice(index, 1);
  }
}
