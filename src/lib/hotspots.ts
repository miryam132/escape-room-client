type Linked = { id: string; requiresHotspotId?: string };

/** True if following the "requires" chain from `startId` leads back to `currentId` (or loops). */
export function hasCycle(hotspots: Linked[], currentId: string, startId: string) {
  const visited = new Set([currentId]);
  for (let id = startId; id;) {
    if (visited.has(id)) return true;
    visited.add(id);
    id = hotspots.find((h) => h.id === id)?.requiresHotspotId ?? "";
  }
  return false;
}
