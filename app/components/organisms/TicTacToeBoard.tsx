import { useEffect, useState } from "react";
import type { Marker, TicTacToeBoardState } from "~/types/game";
import { getWinningLines } from "~/utils/gameLogic";
import XMarker from "../atoms/icons/XMarker";
import OMarker from "../atoms/icons/OMarker";

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
      console.log("onGameOver Called!");

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
    <section className="bg-dark min-w-5xs grid aspect-square grow grid-cols-3 items-center justify-center gap-2 overflow-hidden">
      {state.map((marker, index) => (
        <button
          key={`square-${index}`}
          type="button"
          className="text-dark bg-background aspect-square w-full cursor-pointer p-1 disabled:cursor-default"
          disabled={!!marker || isGameOver}
          onClick={() => {
            onClickCell(index);
          }}
        >
          {marker === "x" && <XMarker className="stroke-dark" />}
          {marker === "o" && <OMarker className="stroke-secondary" />}
        </button>
      ))}
    </section>
  );
};

export default TicTacToeBoard;
