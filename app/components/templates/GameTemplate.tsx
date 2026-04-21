import {
  type TicTacToeBoardState,
  type GameSession,
  type Marker,
  type Role,
} from "~/types/game";
import TicTacToeBoard from "../organisms/TicTacToeBoard";
import { useEffect, useState } from "react";
import { endMatch, makeMove, rematch } from "~/services/firebase/game.service";
import PlayerCard from "../molecules/PlayerCard";
import Button from "../atoms/Button";

type Props = {
  roomId: string;
  session: GameSession;
  role: Role;
};

const getMarker = (gameSession: GameSession, role: Role): Marker => {
  if (role === "spectator") return "";
  if (role === "host") return gameSession.host_marker;
  else {
    if (gameSession.host_marker === "o") return "x";
    else return "o";
  }
};

const GameTemplate = ({ roomId, session, role }: Props) => {
  const [localBoardState, setLocalBoardState] = useState<TicTacToeBoardState>(
    session.board,
  );
  const yourMarker: Marker = getMarker(session, role);
  const opponentMarker: Marker = yourMarker === "x" ? "o" : "x";

  useEffect(() => {
    setLocalBoardState(session.board);
  }, [session]);

  return (
    <main className="container mx-auto flex h-screen flex-col justify-center space-y-2 p-10">
      {/* scoreboard */}
      <div className="flex justify-between">
        {role === "host" || role === "spectator" ? (
          <PlayerCard
            nickname={session.host_name}
            marker={
              role === "spectator" ? getMarker(session, "host") : yourMarker
            }
            score={session.score_host}
          />
        ) : (
          <PlayerCard
            nickname={session.guest_name}
            marker={yourMarker}
            score={session.score_guest}
          />
        )}

        <div>
          <div>round</div>
          <div>{session.round}</div>
        </div>

        {role === "host" ? (
          <PlayerCard
            nickname={session.guest_name}
            marker={opponentMarker}
            score={session.score_guest}
          />
        ) : (
          <PlayerCard
            nickname={session.host_name}
            marker={
              role === "spectator"
                ? getMarker(session, "guest")
                : opponentMarker
            }
            score={session.score_host}
          />
        )}
      </div>

      <div className="flex justify-center">
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
      </div>

      {session.status === "completed" && (
        <Button
          onClick={() => {
            rematch(roomId, session.host_marker);
          }}
        >
          Rematch
        </Button>
      )}
    </main>
  );
};

export default GameTemplate;
