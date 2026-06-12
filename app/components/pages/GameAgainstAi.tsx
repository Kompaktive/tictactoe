import { type TicTacToeBoardState, type Marker } from "~/types/game";
import TicTacToeBoard from "../organisms/TicTacToeBoard";
import { useEffect, useRef, useState } from "react";
import Button from "../atoms/Button";
import Scoreboard from "../organisms/Scoreboard";

const GameAgainstAi = () => {
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [yourScore, setYourScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

  const depthLimits: number[] = [1, 3, Infinity];
  const [selectedDepthLimit, setSelectedDepthLimit] = useState<number>(0);

  const translateDifficulty = (): string => {
    switch (depthLimits[selectedDepthLimit]) {
      case 1:
        return "Normal";
      case 3:
        return "Hard";
      case Infinity:
        return "Impossible";
      default:
        return "Unknown";
    }
  };

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
      depthLimit: depthLimits[selectedDepthLimit],
    });
  }, [currentTurn, isGameOver, opponentMarker, selectedDepthLimit]);

  return (
    <main className="flex grow flex-col justify-center space-y-8 px-8">
      <Scoreboard
        round={round}
        currentTurn={currentTurn}
        isGameOver={isGameOver}
        host={{
          nickname: "You",
          marker: yourMarker,
          score: yourScore,
        }}
        guest={{
          nickname: "AI",
          marker: opponentMarker,
          score: opponentScore,
        }}
      />

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

      <div className="flex items-center gap-2">
        <Button
          className="text-accent-1 border-accent-1 hover:border-accent-2 hover:text-accent-2 border bg-transparent py-2 hover:bg-transparent"
          onClick={() => {
            console.log(depthLimits[selectedDepthLimit]);
            setSelectedDepthLimit((prev) => (prev + 1) % depthLimits.length);
          }}
        >
          AI: {translateDifficulty()}
        </Button>
        <Button
          className="py-2"
          disabled={!isGameOver}
          onClick={() => resetGame()}
        >
          Replay
        </Button>
      </div>
    </main>
  );
};

export default GameAgainstAi;
