import { type TicTacToeBoardState, type Marker } from "~/types/game";
import TicTacToeBoard from "../organisms/TicTacToeBoard";
import { useEffect, useRef, useState } from "react";
import Button from "../atoms/Button";
import { cn } from "~/utils/cn";
import Scoreboard from "../organisms/Scoreboard";

const GameAgainstAi = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [yourScore, setYourScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  const [boardState, setBoardState] = useState<TicTacToeBoardState>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [currentTurn, setCurrentTurn] = useState<Marker>("x");
  const [yourMarker, setYourMarker] = useState<Marker>("x");
  const opponentMarker: Marker = yourMarker === "x" ? "o" : "x";

  const workerRef = useRef<Worker>(null);

  const resetGame = () => {
    setRound((prev) => prev + 1);
    setBoardState(["", "", "", "", "", "", "", "", ""]);
    setCurrentTurn("x");
    if (yourMarker === "x") setYourMarker("o");
    else setYourMarker("x");
    setIsGameOver(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    workerRef.current = new Worker(
      new URL("../../workers/minimax.worker.ts", import.meta.url),
      { type: "module" },
    );

    workerRef.current.onmessage = (e: MessageEvent<{ bestMove: number }>) => {
      const { bestMove } = e.data;

      console.log("placing marker at cell", bestMove);
      setBoardState((prev) => {
        const nextItems: TicTacToeBoardState = [...prev];
        nextItems[bestMove] = opponentMarker;
        return nextItems;
      });

      setCurrentTurn(yourMarker);
    };

    return () => workerRef.current?.terminate();
  }, [opponentMarker, yourMarker]);

  useEffect(() => {
    if (currentTurn !== opponentMarker || isGameOver) return;

    workerRef.current?.postMessage({
      board: boardState,
      aiMarker: opponentMarker,
      depthLimit: 3,
    });
  }, [currentTurn, isGameOver, opponentMarker]);

  return (
    <main className="container mx-auto flex h-screen items-center justify-center">
      <div className="grow space-y-4 p-6 md:space-y-10">
        <section className="space-y-2">
          <div>
            <div>
              *Click to change the difficulty. Changing it will reset the game!
            </div>
            <Button>Normal</Button>
          </div>

          <Scoreboard
            round={round}
            host={{
              nickname: "You",
              marker: yourMarker,
              score: yourScore,
            }}
            guest={{
              nickname: "Opponent AI",
              marker: opponentMarker,
              score: opponentScore,
            }}
          />
        </section>

        <TicTacToeBoard
          state={boardState}
          onClickCell={async (cellIndex) => {
            if (currentTurn !== yourMarker || isGameOver) return;

            setBoardState((prev) => {
              const nextItems: TicTacToeBoardState = [...prev];
              nextItems[cellIndex] = currentTurn;
              return nextItems;
            });
            setCurrentTurn(opponentMarker);
          }}
          onGameOver={async (result) => {
            setIsGameOver(true);

            if (result.winner === yourMarker) setYourScore((prev) => prev + 1);
            if (result.winner === opponentMarker)
              setOpponentScore((prev) => prev + 1);
          }}
        />
        <Button
          className={cn(!isGameOver && "invisible")}
          disabled={!isGameOver}
          onClick={() => {
            resetGame();
          }}
        >
          Rematch
        </Button>
      </div>
    </main>
  );
};

export default GameAgainstAi;
