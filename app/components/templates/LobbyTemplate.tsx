import { ref, runTransaction } from "firebase/database";
import { database } from "~/firebase";
import { useUidCookies } from "~/hooks/useUidCookies";
import useNicknameStore from "~/stores/useNicknameStore";
import type { GameSession, Pairing, Player } from "~/types/game";
import { generateRandomNickname } from "~/utils/generate";
import TextField from "../atoms/TextField";

type Props = {
  roomId: string;
  host: Player;
};

const LobbyTemplate = ({ roomId, host }: Props) => {
  const { uid: uidCookies, setUid: setUidCookie } = useUidCookies();
  const { nickname: storedNickname, setNickname: storeNickname } =
    useNicknameStore();

  const isHost: boolean = host.uid === uidCookies;

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

  const joinAsGuest = async () => {
    // ! duplicate code in PlayWithFriendMenu.tsx
    const uid: string = uidCookies ?? crypto.randomUUID();
    const nickname: string = !!storedNickname
      ? storedNickname
      : generateRandomNickname();

    if (!uidCookies) setUidCookie(uid);
    if (!storedNickname) storeNickname(nickname);

    const guestRef = ref(database, `rooms/${roomId}/guest`);
    const writeNewGuest = await runTransaction(guestRef, (guest: Player) => {
      const data: Player = {
        nickname: nickname,
        uid: uid,
      };
      if (!guest) return data;
      else {
        console.warn(`guest in ${roomId} already exists, aborting...`, guest);

        if (guest.uid === uidCookies) {
          console.warn(`the existing guest is you! Creating the game...`);
          writeGameSession(roomId, {
            host: host,
            guest: {
              nickname: nickname,
              uid: uid,
            },
          });
        }
      }
    });

    if (writeNewGuest.committed) {
      console.log("Joined as a guest");
      writeGameSession(roomId, {
        host: host,
        guest: {
          nickname: nickname,
          uid: uid,
        },
      });
    }
  };

  return (
    <main className="mx-8 flex h-screen flex-col items-center justify-center">
      <section className="bg-dark rounded-2xl p-4 text-white">
        {isHost ? (
          <Invitation />
        ) : (
          <>
            <label className="relative">
              <span className="absolute -top-8">Enter your nickname</span>
              <TextField
                className="w-full"
                value={storedNickname}
                onChange={(e) => storeNickname(e.target.value)}
                spellCheck={false}
                maxLength={15}
              />
            </label>
            Host: {host.nickname}
            <button
              className="bg-background w-full rounded-lg p-2"
              onClick={() => joinAsGuest()}
            >
              Join Game
            </button>
          </>
        )}
      </section>
    </main>
  );
};

const Invitation = () => {
  return (
    <>
      Click to copy. Send this link to your friend
      <button
        className="bg-background w-full rounded-lg p-2"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
      >
        {window.location.href}
      </button>
    </>
  );
};

export default LobbyTemplate;
