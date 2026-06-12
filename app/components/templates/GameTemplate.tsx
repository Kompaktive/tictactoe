import {
  type TicTacToeBoardState,
  type GameSession,
  type Marker,
  type Role,
} from "~/types/game";
import TicTacToeBoard from "../organisms/TicTacToeBoard";
import { useEffect, useState } from "react";
import { endMatch, makeMove, rematch } from "~/services/firebase/game.service";
import Button from "../atoms/Button";
import { cn } from "~/utils/cn";
import { getAssignedMarker } from "~/utils/onlineGameLogic";
import Scoreboard from "../organisms/Scoreboard";

type Props = {
  roomId: string;
  session: GameSession;
  role: Role;
};

const GameTemplate = ({ roomId, session, role }: Props) => {
  const [localBoardState, setLocalBoardState] = useState<TicTacToeBoardState>(
    session.board,
  );
  const yourMarker: Marker = getAssignedMarker(session, role);
  const opponentMarker: Marker = yourMarker === "x" ? "o" : "x";

  const playedAsGuest: boolean = role === "guest";
  const isSpectator: boolean = role === "spectator";

  useEffect(() => {
    setLocalBoardState(session.board);
  }, [session]);

  return (
    <main className="container mx-auto flex h-screen items-center justify-center">
      <div className="grow space-y-4 p-6 md:space-y-10">
        <Scoreboard
          round={session.round}
          currentTurn={session.turn}
          isGameOver={session.status === "completed"}
          host={{
            nickname: playedAsGuest ? session.guest_name : session.host_name,
            marker: isSpectator
              ? getAssignedMarker(session, "host")
              : yourMarker,
            score: playedAsGuest ? session.score_guest : session.score_host,
          }}
          guest={{
            nickname: playedAsGuest ? session.host_name : session.guest_name,
            marker: isSpectator
              ? getAssignedMarker(session, "guest")
              : opponentMarker,
            score: playedAsGuest ? session.score_host : session.score_guest,
          }}
        />

        <TicTacToeBoard
          state={localBoardState}
          onClickCell={async (cellIndex) => {
            console.log("cellIndex", cellIndex);
            console.log(session.turn);
            console.log(yourMarker);

            if (session.turn !== yourMarker || session.status === "completed")
              return;

            setLocalBoardState((prev) => {
              const nextItems: TicTacToeBoardState = [...prev];
              nextItems[cellIndex] = session.turn;
              return nextItems;
            });

            const result = await makeMove({
              roomId: roomId,
              cellIndex: cellIndex,
              marker: yourMarker,
              currentTurn: session.turn,
            });
            if (!result.isSuccess) {
              // TODO: pop up toast error
              console.error("Failed to write cell", result.error);
              setLocalBoardState(session.board);
            }
          }}
          onGameOver={async (result) => {
            // draw mechanism
            if (session.status === "ongoing" && !result.winner) {
              await endMatch(roomId);
              return;
            }

            if (
              session.status === "completed" ||
              role === "spectator" ||
              result.winner !== yourMarker
            )
              return;

            const winnerField: keyof Pick<
              GameSession,
              "score_host" | "score_guest"
            > =
              result.winner === session.host_marker
                ? "score_host"
                : "score_guest";
            await endMatch(roomId, winnerField);
          }}
        />

        <Button
          className={cn(session.status === "ongoing" && "invisible")}
          disabled={session.status === "ongoing"}
          onClick={() => {
            rematch(roomId, session.host_marker);
          }}
        >
          Rematch
        </Button>
      </div>
    </main>
  );
};

export default GameTemplate;
