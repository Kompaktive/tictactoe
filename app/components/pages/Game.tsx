import { useEffect, useState } from "react";
import { onValue, ref, runTransaction } from "firebase/database";
import type { GameSession, Pairing, Player, Role } from "~/types/game";
import { database } from "~/firebase";
import LobbyTemplate from "../templates/LobbyTemplate";
import GameTemplate from "../templates/GameTemplate";
import { roomRef } from "~/services/firebase/room.service";
import { useUidCookies } from "~/hooks/useUidCookies";
import useNicknameStore from "~/stores/useNicknameStore";

type Props = {
  roomId: string;
};

const Game = ({ roomId }: Props) => {
  const { uid } = useUidCookies();
  const { nickname, hasHydrated } = useNicknameStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [role, setRole] = useState<Role>("spectator");
  const [game, setGame] = useState<GameSession>();

  const writeGameSession = async (
    roomId: string,
    pairing: Required<Pairing>,
  ) => {
    const gameSessionRef = ref(database, `game-sessions/${roomId}`);
    const result = await runTransaction(
      gameSessionRef,
      (session: GameSession) => {
        const xMarker: boolean = Math.random() < 0.5;
        const data: GameSession = {
          turn: "x",
          board: ["", "", "", "", "", "", "", "", ""],
          host_name: pairing.host.nickname,
          host_marker: xMarker ? "x" : "o",
          guest_name: pairing.guest!.nickname,
          round: 1,
          score_host: 0,
          score_guest: 0,
          status: "ongoing",
        };

        if (!session) return data;
        else {
          console.warn(
            `game in ${roomId} already in session, aborting...`,
            session,
          );
        }
      },
    );

    if (result.committed) {
      console.log("game is now in session. Enjoy!");
    }
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const unsubscribe = onValue(roomRef(roomId), async (snapshot) => {
      const room: Pairing = snapshot.val();

      // check for matching uid to prevent filling the room with the same user
      if (room.host.uid === uid) setRole("host");
      else if (!!room.guest) {
        if (room.guest.uid === uid) setRole("guest");
        else setRole("spectator");
      } else {
        const guestRef = ref(database, `rooms/${roomId}/guest`);
        const writeNewGuest = await runTransaction(
          guestRef,
          (guest: Player) => {
            const data: Player = {
              nickname: nickname,
              uid: uid,
            };
            if (!guest) return data;
            else {
              console.warn(
                `guest in ${roomId} already exists, aborting...`,
                room,
              );
            }
          },
        );

        if (writeNewGuest.committed) {
          console.log("Joined as a guest");
          writeGameSession(roomId, {
            host: room.host,
            guest: {
              nickname: nickname,
              uid: uid,
            },
          });
        }
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [uid, hasHydrated]);

  useEffect(() => {
    const gameRef = ref(database, `game-sessions/${roomId}`);

    const unsubscribe = onValue(gameRef, async (snapshot) => {
      const session: GameSession = snapshot.val();
      setGame(session);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  return !!game ? (
    <GameTemplate roomId={roomId} session={game} role={role} />
  ) : (
    <LobbyTemplate />
  );
};

export default Game;
