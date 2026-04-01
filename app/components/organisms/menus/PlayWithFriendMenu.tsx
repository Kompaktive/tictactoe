import { ref, runTransaction, type DatabaseReference } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "~/components/atoms/Button";
import TextField from "~/components/atoms/TextField";
import { database } from "~/firebase";
import { checkRoomExists } from "~/helpers/room";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import useNicknameStore from "~/stores/useNicknameStore";
import usePlayerUidStore from "~/stores/usePlayerUidStore";
import type { Pairing } from "~/types/game";
import { generateRandomCode } from "~/utils/crypto";

const PlayWithFriendMenu = () => {
  const navigate = useNavigate();
  const { popMenuNavigationHistory } = useMenuNavigationHistoryStore();

  const { uid: storedUid, setUid: setStoredUid } = usePlayerUidStore();
  const { nickname: storedNickname, setNickname: setStoredNickname } =
    useNicknameStore();

  // join room states
  const [roomCodeInput, setRoomCodeInput] = useState<string>("");
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const writeNewRoom = async (
    roomHost: Omit<Pairing, "guest">,
    attempt: number = 0,
  ) => {
    const MAX_ATTEMPTS: number = 10;

    if (attempt >= MAX_ATTEMPTS) {
      // TODO: display max attempts error toast "server is too busy. Please try again later"
      console.error("MAX ATTEMPTS REACHED");
      return;
    }

    try {
      const roomId: string = generateRandomCode();
      const roomRef: DatabaseReference = ref(database, `rooms/${roomId}`);

      const result = await runTransaction(roomRef, (room: Pairing | null) => {
        if (!room) return roomHost;
        else {
          console.warn(
            `room with ID ${roomId} already exists, aborting...`,
            room,
          );
          return;
        }
      });

      if (result.committed) navigate(`/${roomId}`);
      else {
        console.error("Lobby creation failed: Room code taken");
        return await writeNewRoom(roomHost, attempt + 1);
      }
    } catch (error) {
      console.error("Failed to create lobby", error);
      // TODO: display toast
    }
  };

  const createRoom = async () => {
    let nickname: string;
    let hostUid: string;

    if (!storedUid) {
      const generatedHostUid: string = crypto.randomUUID();
      setStoredUid(generatedHostUid);
      hostUid = generatedHostUid;
    } else hostUid = storedUid;

    if (!storedNickname) {
      const generatedNickname: string = "Generated Nickname";
      setStoredNickname(generatedNickname);
      nickname = generatedNickname;
    } else nickname = storedNickname;

    await writeNewRoom({
      host: {
        nickname: nickname,
        uid: hostUid,
      },
    });

    // onValue(roomRef, (snapshot) => {
    //   const lobbyData: Lobby = snapshot.val();
    //   console.log("LOBBY DATAAAA", lobbyData);

    //   // TODO: if both player is present, then proceed to the game session
    //   /* //TODO: initialize game session
    //   const gameSession: GameSession = {
    //     active_player: "",
    //     board: ["", "", "", "", "", "", "", "", ""],
    //     last_move_at: 0,
    //     round: 0,
    //     score_o: 0,
    //     score_x: 0,
    //     status: "waiting",
    //     player_o: "",
    //     player_x: "",
    //   };
    //   */
    // });
  };

  const joinRoom = async () => {
    setIsJoining(true);
    const roomExists = await checkRoomExists(roomCodeInput);
    if (roomExists) navigate(`/${roomCodeInput}`);
    setIsJoining(false);
  };

  return (
    <>
      <div className="space-y-2">
        <Button className="w-full" onClick={() => createRoom()}>
          Create a room
        </Button>
        <TextField
          className="w-full"
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          spellCheck={false}
        />
        <Button
          className="w-full"
          disabled={isJoining}
          onClick={() => joinRoom()}
        >
          {isJoining ? "Joining..." : "Join Room"}
        </Button>
      </div>

      <Button
        className="mt-8 w-full"
        onClick={() => popMenuNavigationHistory()}
      >
        Back
      </Button>
    </>
  );
};

export default PlayWithFriendMenu;
