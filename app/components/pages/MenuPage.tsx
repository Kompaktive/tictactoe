import { useNavigate } from "react-router";
import { motion } from "motion/react";
import useNicknameStore from "~/stores/useNicknameStore";
import useMenuNavigationHistoryStore from "~/stores/useMenuNavigationHistoryStore";
import PlayWithFriendMenu from "../organisms/menus/PlayWithFriendMenu";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { TicTacToeIcon } from "../atoms/icons/TicTacToeIcon";

const MenuPage = () => {
  const { menuNavigationHistory, pushMenuNavigationHistory } =
    useMenuNavigationHistoryStore();
  const { nickname, setNickname } = useNicknameStore();

  const navigate = useNavigate();

  return (
    <main className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <div className="container space-y-2 px-8">
        <header className="text-72 font-google relative mb-24 text-center leading-14 font-black">
          <TicTacToeIcon
            initial={{ scale: 0.9, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 0.1, rotate: -186 }}
            transition={{
              duration: 1,
            }}
            className="absolute -top-48 right-0 size-72"
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            TIC
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-accent-2"
          >
            TAC
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            TOE
          </motion.div>

          <TicTacToeIcon
            initial={{ scale: 0.9, opacity: 0, rotate: 0 }}
            animate={{ scale: 1, opacity: 0.2, rotate: 12 }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
            className="absolute -bottom-12 left-20 size-48"
          />
        </header>

        <motion.div
          initial={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mx-auto max-w-2xs space-y-2"
        >
          <TextField
            className="w-full"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            spellCheck={false}
            maxLength={15}
          />

          <section>
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
        </motion.div>
      </div>
    </main>
  );
};

export default MenuPage;
