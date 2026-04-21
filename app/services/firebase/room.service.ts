import { child, get, ref, type DatabaseReference } from "firebase/database";
import { database } from "~/firebase";
import type { Pairing } from "~/types/game";

export const roomRef = (roomId: string): DatabaseReference =>
  child(ref(database), `rooms/${roomId}`);

export const getRoom = (roomId: string) => {
  return get(roomRef(roomId));
};

export const checkRoomExists = async (roomId: string): Promise<boolean> => {
  if (!roomId) return false;
  return (await getRoom(roomId)).exists();
};

export const hasGuest = async (roomId: string): Promise<boolean> => {
  const snapshot: Pairing = (await getRoom(roomId)).val();

  if (!!snapshot.guest) return true;
  return false;
};
