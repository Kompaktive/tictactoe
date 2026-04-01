import { child, get, ref } from "firebase/database";
import { database } from "~/firebase";

export const checkRoomExists = async (code: string): Promise<boolean> => {
  if (!code) return false;
  return (await get(child(ref(database), `rooms/${code}`))).exists();
};
