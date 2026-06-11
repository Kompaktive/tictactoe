import { useEffect, useState } from "react";
import type { Marker, TicTacToeBoardState } from "~/types/game";
import { getWinningLines } from "~/utils/gameLogic";
import XMarker from "../atoms/icons/XMarker";
import OMarker from "../atoms/icons/OMarker";
import { motion } from "motion/react";

type GameOver = {
  winner: Marker;
  lines: number[][];
};

type Props = {
  state: TicTacToeBoardState;
  onClickCell: (index: number) => void;
  onGameOver: (result: GameOver) => void;
};

const TicTacToeBoard = ({ state, onClickCell, onGameOver }: Props) => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    const xWins = getWinningLines(state, "x");
    const oWins = getWinningLines(state, "o");
    const hasNoMove = !state.filter((marker) => !marker).length;

    if (!!xWins.length || !!oWins.length || hasNoMove) {
      setIsGameOver(true);

      if (!!xWins.length || !!oWins.length) {
        onGameOver({
          winner: !!xWins.length ? "x" : "o",
          lines: !!xWins.length ? xWins : oWins,
        });
      } else if (hasNoMove) {
        onGameOver({
          winner: "",
          lines: [],
        });
      }
    } else setIsGameOver(false);
  }, [state]);

  return (
    <motion.section
      className="min-w-5xs grid aspect-square grid-cols-3 items-center justify-center overflow-hidden"
      initial={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.5,
      }}
    >
      {state.map((marker, index) => (
        <button
          key={`square-${index}`}
          type="button"
          className="border-secondary aspect-square w-full cursor-pointer border-t-2 border-l-2 p-1 disabled:cursor-default nth-[-n+3]:border-t-0 nth-[3n+1]:border-l-0"
          disabled={!!marker || isGameOver}
          onClick={() => {
            onClickCell(index);
          }}
        >
          {marker === "x" && <XMarker enableAnimation />}
          {marker === "o" && <OMarker enableAnimation />}
        </button>
      ))}
    </motion.section>
  );
};

export default TicTacToeBoard;
