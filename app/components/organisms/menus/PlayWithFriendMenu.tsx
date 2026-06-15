import {
  push,
  ref,
  runTransaction,
  type DatabaseReference,
} from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "~/components/atoms/Button";
import TextField from "~/components/atoms/TextField";
import { database } from "~/firebase";
import { useUidCookies } from "~/hooks/useUidCookies";
import { checkRoomExists } from "~/services/firebase/room.service";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import useNicknameStore from "~/stores/useNicknameStore";
import type { Pairing } from "~/types/game";
import { generateRandomCode, generateRandomNickname } from "~/utils/generate";

const PlayWithFriendMenu = () => {
  const navigate = useNavigate();
  const { popMenuNavigationHistory } = useMenuNavigationHistoryStore();

  const { uid: uidCookies, setUid: setUidCookies } = useUidCookies();
  const { nickname: storedNickname, setNickname: storeNickname } =
    useNicknameStore();

  // create room states
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false);

  // join room states
  const [roomCodeInput, setRoomCodeInput] = useState<string>("");
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const writeNewRoom = async (
    roomHost: Omit<Pairing, "guest">,
    attempt: number = 0,
  ) => {
    const MAX_ATTEMPTS: number = 10;

    if (attempt >= MAX_ATTEMPTS) {
      toast("Server is too busy. Please try again later!", { type: "error" });
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
      toast("Failed to create lobby.", { type: "error" });
      console.error("Failed to create lobby", error);
    }
  };

  const createRoom = async () => {
    if (isCreatingRoom) return;

    setIsCreatingRoom(true);

    try {
      const uid: string = uidCookies ?? crypto.randomUUID();
      const nickname: string = !!storedNickname
        ? storedNickname
        : generateRandomNickname();

      if (!uidCookies) setUidCookies(uid);
      if (!storedNickname) storeNickname(nickname);

      await writeNewRoom({
        host: {
          nickname: nickname,
          uid: uid,
        },
      });
    } catch (err) {
      console.error("error in createRoom():", err);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinRoom = async () => {
    setIsJoining(true);
    const roomExists = await checkRoomExists(roomCodeInput);
    if (roomExists) navigate(`/${roomCodeInput}`);
    setIsJoining(false);
  };

  return (
    <div className="space-y-2">
      <Button disabled={isCreatingRoom} onClick={() => createRoom()}>
        {isCreatingRoom ? "Initializing..." : "Create a room"}
      </Button>

      <span className="block text-center">- or -</span>

      <div className="flex gap-2">
        <TextField
          placeholder="Enter room code"
          maxLength={8}
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          spellCheck={false}
        />
        <Button disabled={isJoining} onClick={() => joinRoom()}>
          {isJoining ? "Joining..." : "Join Room"}
        </Button>
      </div>

      <Button className="mt-10" onClick={() => popMenuNavigationHistory()}>
        Back
      </Button>
    </div>
  );
};

export default PlayWithFriendMenu;
