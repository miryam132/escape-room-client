
import { rooms } from "./rooms.ts";

export async function getRooms() {
  return [...rooms];
}

export async function getRoomById(id: string){
    
    return rooms.find(room => room.id===id)??null;
}
export async function deleteRoom(id: string) {
  const index = rooms.findIndex((room) => room.id === id);

  if (index === -1) {
    throw new Error("החדר לא נמצא");
  }

  rooms.splice(index, 1);
}