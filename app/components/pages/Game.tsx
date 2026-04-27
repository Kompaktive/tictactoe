import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import LobbyTemplate from "../templates/LobbyTemplate";
import GameTemplate from "../templates/GameTemplate";
import { useRole } from "~/hooks/useRole";
import { database } from "~/firebase";
import type { GameSession } from "~/types/game";

type Props = {
  roomId: string;
};

const Game = ({ roomId }: Props) => {
  const { role, pairing, isLoadingRole } = useRole(roomId);
  const [game, setGame] = useState<GameSession>();

  useEffect(() => {
    const gameRef = ref(database, `game-sessions/${roomId}`);

    const unsubscribe = onValue(gameRef, async (snapshot) => {
      const session: GameSession = snapshot.val();
      setGame(session);
    });

    return () => unsubscribe();
  }, []);

  if (isLoadingRole || !pairing?.host) return <div>Loading...</div>;
  return !!game ? (
    <GameTemplate roomId={roomId} session={game} role={role} />
  ) : (
    <LobbyTemplate roomId={roomId} host={pairing.host} />
  );
};

export default Game;
