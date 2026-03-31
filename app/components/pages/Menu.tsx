import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import useNicknameStore from "~/stores/useNicknameStore";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import PlayWithFriendMenu from "../organisms/menus/PlayWithFriendMenu";

type Marker = "o" | "x" | "";

type Player = {
  nickname: string;
  uid: string;
};

type Lobby = {
  player_1?: Player | null;
  player_2?: Player | null;
};

// prettier-ignore
type GameSession = {
  active_player: Marker;
  board: [Marker, Marker, Marker, Marker, Marker, Marker, Marker, Marker, Marker];
  last_move_at: number; // Date timestamp in millisecond
  player_o: Player["nickname"]
  player_x: Player["nickname"]
  round: number;
  score_o: number;
  score_x: number;
  status: "waiting" | "ongoing" | "completed";
};

const Menu = () => {
  const { menuNavigationHistory, pushMenuNavigationHistory } =
    useMenuNavigationHistoryStore();
  const { nickname, setNickname } = useNicknameStore();

  return (
    <main className="mx-8 flex h-screen flex-col items-center justify-center">
      <div className="container w-full">
        <label className="relative">
          <span className="absolute -top-8">Enter your nickname</span>
          <TextField
            className="w-full"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            spellCheck={false}
          />
        </label>

        <section className="mt-2">
          {/* main menu */}
          {!menuNavigationHistory.length && (
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => pushMenuNavigationHistory("PLAY_WITH_FRIEND")}
              >
                Play with Friend
              </Button>

              <div className="flex items-center gap-x-2">
                <Button className="w-full" onClick={() => {}}>
                  Practice with AI
                </Button>
                <Button className="w-full">Difficulty: Impossible</Button>
              </div>
            </div>
          )}

          {/* play with friend menu */}
          {menuNavigationHistory[menuNavigationHistory.length - 1] ===
            "PLAY_WITH_FRIEND" && <PlayWithFriendMenu />}
        </section>
      </div>
    </main>
  );
};

export default Menu;
