import { TICTACTOE_LINES } from "~/constants/ticTacToeLines";
import type { Marker, TicTacToeBoardState } from "~/types/game";

export const getWinningLines = (
  board: TicTacToeBoardState,
  marker: Marker,
): number[][] => {
  return TICTACTOE_LINES.filter((line) =>
    line.every((i) => board[i] === marker),
  );
};
