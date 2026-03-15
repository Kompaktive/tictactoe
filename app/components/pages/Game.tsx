import useNicknameStore from "~/stores/useNicknameStore";
import { Navigate } from "react-router";

const Game = () => {
  const { nickname } = useNicknameStore();

  if (!nickname) return <Navigate to="/" replace />;

  return <div>game</div>;
};

export default Game;
