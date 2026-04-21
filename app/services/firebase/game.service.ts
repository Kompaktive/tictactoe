import { increment, ref, update } from "firebase/database";
import { database } from "~/firebase";
import type { GameSession, Marker } from "~/types/game";

export const getGameRef = (roomId: string) =>
  ref(database, `game-sessions/${roomId}`);

type MakeMoveOption = {
  roomId: string;
  cellIndex: number;
  marker: Marker;
  currentTurn: Marker;
};

export const makeMove = async ({
  roomId,
  cellIndex,
  marker,
  currentTurn,
}: MakeMoveOption) => {
  const updates: Record<string, any> = {};

  updates[`game-sessions/${roomId}/board/${cellIndex}`] = marker;
  updates[`game-sessions/${roomId}/turn`] = currentTurn === "x" ? "o" : "x";

  try {
    await update(ref(database), updates);
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, error };
  }
};

export const endMatch = async (
  roomId: string,
  field?: keyof Pick<GameSession, "score_host" | "score_guest">,
) => {
  const updates: Record<string, any> = {};

  if (field) updates[`game-sessions/${roomId}/${field}`] = increment(1);
  updates[`game-sessions/${roomId}/status`] = "completed";

  try {
    await update(ref(database), updates);
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, error };
  }
};

export const rematch = async (roomId: string, currentHostMarker: Marker) => {
  const updates: Record<string, any> = {};
  const parent = `game-sessions/${roomId}`;

  updates[`${parent}/board`] = ["", "", "", "", "", "", "", "", ""];
  updates[`${parent}/round`] = increment(1);
  updates[`${parent}/host_marker`] = currentHostMarker === "x" ? "o" : "x";
  updates[`${parent}/turn`] = "x";
  updates[`${parent}/status`] = "ongoing";

  try {
    await update(ref(database), updates);
    return { isSuccess: true };
  } catch (error) {
    return { isSuccess: false, error };
  }
};
