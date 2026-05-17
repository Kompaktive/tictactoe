import type { Marker, TicTacToeBoardState } from "~/types/game";
import { getWinningLines } from "~/utils/gameLogic";

const workerContext: Worker = self as any;

const getEmptyIndexes = (board: TicTacToeBoardState) => {
  return board.reduce<number[]>((accumulator, marker, index) => {
    if (!marker) accumulator.push(index);
    return accumulator;
  }, []);
};

const minimax = (
  board: TicTacToeBoardState,
  aiMarker: Marker,
  depth: number,
  isMax: boolean,
): number => {
  const opponentMarker: Marker = aiMarker === "x" ? "o" : "x";

  if (getWinningLines(board, aiMarker).length) return 10 - depth;
  if (getWinningLines(board, opponentMarker).length) return -10 + depth;
  if (!getEmptyIndexes(board).length) return 0;

  // evaluate my marker (max)
  if (isMax) {
    let best: number = -1000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = aiMarker;
        best = Math.max(best, minimax(board, aiMarker, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    // evaluate the opponent (min)
    let best: number = 1000;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = opponentMarker;
        best = Math.min(best, minimax(board, aiMarker, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
};

const findBestMove = (board: TicTacToeBoardState, aiMarker: Marker): number => {
  let bestVal: number = -1000;
  let bestMove: number = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = aiMarker;
      let moveVal = minimax(board, aiMarker, 0, false);
      board[i] = "";
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
        console.log("cell", bestMove, "eval:", moveVal);
      }
    }
  }
  return bestMove;
};

workerContext.onmessage = (
  e: MessageEvent<{ board: TicTacToeBoardState; aiMarker: Marker }>,
) => {
  const { board, aiMarker } = e.data;
  const opponentMarker: Marker = aiMarker === "x" ? "o" : "x";
  const bestMove = findBestMove(board, aiMarker);

  // a bug fix to prevent the AI from making a move milliseconds
  // before the game over state changes to true
  if (getWinningLines(board, opponentMarker).length) return;

  workerContext.postMessage({ bestMove });
};
