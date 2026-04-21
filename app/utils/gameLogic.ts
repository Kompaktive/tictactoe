import type { Marker, TicTacToeBoardState } from "~/types/game";

export const getWinningLines = (
  board: TicTacToeBoardState,
  marker: Marker,
): number[][] => {
  // prettier-ignore
  const lines: number[][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ]

  return lines.filter((line) => line.every((i) => board[i] === marker));
};
