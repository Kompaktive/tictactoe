import { ref, runTransaction, type DatabaseReference } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "~/components/atoms/Button";
import TextField from "~/components/atoms/TextField";
import { database } from "~/firebase";
import { checkRoomExists } from "~/helpers/room";
import usePlayerIdentity from "~/hooks/usePlayerIdentity";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import type { Pairing } from "~/types/game";
import { generateRandomCode } from "~/utils/generateRandomCode";

const PlayWithFriendMenu = () => {
  const navigate = useNavigate();
  const { popMenuNavigationHistory } = useMenuNavigationHistoryStore();

  const { nickname, uid } = usePlayerIdentity();

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
    await writeNewRoom({
      host: {
        nickname: nickname,
        uid: uid,
      },
    });
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
