import { ref, runTransaction } from "firebase/database";
import { database } from "~/firebase";
import { useUidCookies } from "~/hooks/useUidCookies";
import useNicknameStore from "~/stores/useNicknameStore";
import type { GameSession, Pairing, Player } from "~/types/game";
import { generateRandomNickname } from "~/utils/generate";
import TextField from "../atoms/TextField";
import { TbCopy } from "react-icons/tb";
import Button from "../atoms/Button";
import { MdInfo } from "react-icons/md";

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
    <main className="flex grow flex-col justify-center space-y-8 px-8">
      {isHost ? (
        <article className="bg-secondary rounded-xl p-4 text-white">
          <span className="block">
            Host:{" "}
            <span className="font-google text-accent-1 font-medium">
              {host.nickname}
            </span>
          </span>

          <div className="leading-8">
            <span>Room Code:</span>
            <button className="text-accent-1 flex cursor-pointer gap-1">
              <span className="font-google text-40 font-medium">{roomId}</span>
              <TbCopy size={20} />
            </button>
          </div>

          <hr className="my-4" />

          <p>Send this link to your friend. Click to copy</p>
          <Button
            className="mt-2 flex justify-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            {window.location.href}
            <TbCopy size={20} />
          </Button>
        </article>
      ) : (
        <section className="space-y-10">
          <TextField
            className="w-full"
            placeholder="Enter your nickname"
            value={storedNickname}
            onChange={(e) => storeNickname(e.target.value)}
            spellCheck={false}
            maxLength={15}
          />

          <div className="space-y-4">
            <article className="border-secondary flex items-center gap-2 rounded-xl border-2 p-4">
              <MdInfo size={18} />
              Host: <span className="font-medium">{host.nickname}</span>
            </article>

            <Button onClick={() => joinAsGuest()}>Join Game</Button>
          </div>
        </section>
      )}
    </main>
  );
};

export default LobbyTemplate;
