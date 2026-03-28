import { child, get, ref } from "firebase/database";
import { database } from "~/firebase";
import { generateRandomCode } from "~/utils/crypto";

export const generateUniqueRoomCode = async (): Promise<string> => {
  const code = generateRandomCode();
  const roomExists: boolean = (
    await get(child(ref(database), `rooms/${code}`))
  ).exists();

  if (roomExists) {
    console.log("room already exist! Generating new room code...");
    return generateUniqueRoomCode();
  }

  console.log("room code is unique");
  return code;
};
