import { ref, set, type DatabaseReference } from "firebase/database";
import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "~/components/atoms/Button";
import TextField from "~/components/atoms/TextField";
import { database } from "~/firebase";
import { checkRoomExists, generateUniqueRoomCode } from "~/helpers/room";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import useNicknameStore from "~/stores/useNicknameStore";
import usePlayerUidStore from "~/stores/usePlayerUidStore";

const PlayWithFriendMenu = () => {
  const navigate = useNavigate();
  const { popMenuNavigationHistory } = useMenuNavigationHistoryStore();

  const { uid: storedUid, setUid: setStoredUid } = usePlayerUidStore();
  const { nickname: storedNickname, setNickname: setStoredNickname } =
    useNicknameStore();

  // join room states
  const [roomCodeInput, setRoomCodeInput] = useState<string>("");
  const [isJoining, setIsJoining] = useState<boolean>(false);

  const createRoom = async () => {
    const roomId: string = await generateUniqueRoomCode();
    const roomRef: DatabaseReference = ref(database, `rooms/${roomId}`);

    let nickname: string;
    let playerUid: string;

    if (!storedUid) {
      const generatedPlayerUid: string = crypto.randomUUID();
      setStoredUid(generatedPlayerUid);
      playerUid = generatedPlayerUid;
    } else playerUid = storedUid;

    if (!storedNickname) {
      const generatedNickname: string = "Generated Nickname";
      setStoredNickname(generatedNickname);
      nickname = generatedNickname;
    } else nickname = storedNickname;

    set(roomRef, {
      player_1: {
        nickname: nickname,
        uid: playerUid,
      },
    })
      .then(() => {
        navigate(`/${roomId}`);
      })
      .catch(() => {
        console.error("Failed to create lobby");
        // TODO: display toast
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
