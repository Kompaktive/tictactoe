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

export const setLinePosition = (board: TicTacToeBoardState): string => {
  const threeInARow = TICTACTOE_LINES.findIndex((line) => {
    const marker = board[line[0]];
    return !!marker && line.every((i) => board[i] === marker);
  });

  switch (threeInARow) {
    // horizontal
    case 0: // row 1 (up)
      return "top-[15%]";
    case 1: // row 2 (mid)
      return "";
    case 2: // row 3 (btm)
      return "top-[84%] -translate-y-1/2";

    // vertical
    case 3: // col 1 (left)
      return "rotate-90 top-0 left-[17%]";
    case 4: // col 2 (mid)
      return "rotate-90 top-0 left-1/2";
    case 5: // col 3 (right)
      return "rotate-90 top-0 left-[84%]";

    // diagonal
    case 6:
      return "rotate-45 top-0";
    case 7:
      return "-rotate-45 bottom-0";
    default:
      return "hidden";
  }
};

export const setLineWidth = (board: TicTacToeBoardState): string => {
  const threeInARow = TICTACTOE_LINES.findIndex((line) => {
    const marker = board[line[0]];
    return !!marker && line.every((i) => board[i] === marker);
  });

  if (threeInARow === 6 || threeInARow === 7) {
    return "141%";
  }
  return "100%";
};
