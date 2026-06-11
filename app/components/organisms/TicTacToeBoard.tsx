import { useEffect, useState } from "react";
import type { Marker, TicTacToeBoardState } from "~/types/game";
import {
  getWinningLines,
  setLinePosition,
  setLineWidth,
} from "~/utils/gameLogic";
import XMarker from "../atoms/icons/XMarker";
import OMarker from "../atoms/icons/OMarker";
import {
  AnimatePresence,
  motion,
  useAnimate,
  type AnimationScope,
} from "motion/react";
import { cn } from "~/utils/cn";

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
      className="min-w-5xs relative grid aspect-square grid-cols-3 items-center justify-center"
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
          className="border-secondary relative aspect-square w-full cursor-pointer border-t-2 border-l-2 p-1 disabled:cursor-default nth-[-n+3]:border-t-0 nth-[3n+1]:border-l-0"
          disabled={!!marker || isGameOver}
          onClick={() => {
            onClickCell(index);
          }}
        >
          {marker === "x" && (
            <XMarker
              className="absolute top-1/2 left-1/2 -translate-1/2"
              enableAnimation
            />
          )}
          {marker === "o" && (
            <OMarker
              className="absolute top-1/2 left-1/2 -translate-1/2"
              enableAnimation
            />
          )}
        </button>
      ))}

      {/* line */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            className={cn(
              setLinePosition(state),
              "pointer-events-none absolute h-2 origin-[left_center] rounded-full bg-white select-none",
            )}
            initial={{ width: 0 }}
            animate={{ width: setLineWidth(state) }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default TicTacToeBoard;
