import { child, get, ref } from "firebase/database";
import { database } from "~/firebase";
import { generateRandomCode } from "~/utils/crypto";

export const checkRoomExists = async (code: string): Promise<boolean> => {
  if (!code) return false;
  return (await get(child(ref(database), `rooms/${code}`))).exists();
};

export const generateUniqueRoomCode = async (): Promise<string> => {
  const code = generateRandomCode();

  if (await checkRoomExists(code)) {
    console.log("room already exist! Generating new room code...");
    return generateUniqueRoomCode();
  }

  console.log("room code is unique");
  return code;
};
