import { useNavigate } from "react-router";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import useNicknameStore from "~/stores/useNicknameStore";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import PlayWithFriendMenu from "../organisms/menus/PlayWithFriendMenu";

const Menu = () => {
  const { menuNavigationHistory, pushMenuNavigationHistory } =
    useMenuNavigationHistoryStore();
  const { nickname, setNickname } = useNicknameStore();

  const navigate = useNavigate();

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
            maxLength={15}
          />
        </label>

        <section className="mt-12">
          {/* main menu */}
          {!menuNavigationHistory.length && (
            <div className="space-y-2">
              <Button
                onClick={() => pushMenuNavigationHistory("PLAY_WITH_FRIEND")}
              >
                Play with Friend
              </Button>

              <Button onClick={() => navigate("/ai")}>Play against AI</Button>
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
