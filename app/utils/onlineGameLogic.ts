import type { GameSession, Marker, Role } from "~/types/game";

export const getAssignedMarker = (
  gameSession: GameSession,
  role: Role,
): Marker => {
  if (role === "spectator") return "";
  if (role === "host") return gameSession.host_marker;

  // the opposite of whatever the host has
  return gameSession.host_marker === "x" ? "o" : "x";
};
