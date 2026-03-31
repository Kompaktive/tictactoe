type Props = {
  roomId: string;
};

const Game = ({ roomId }: Props) => {
  // const { nickname } = usePlayerStore();

  // if (!nickname) return <Navigate to="/" replace />;

  // {
  //   "sessions": {
  //     "session_123": {
  //       "status": "ongoing",
  //       "active_player": "x",
  //       "last_move_at": 1711054800
  //     }
  //   },
  //   "boards": {
  //     "session_123": ["x", "", "o", "", "", "", "", "", ""]
  //   },
  //   "members": {
  //     "session_123": { "x": "UID_1", "o": "UID_2" }
  //   },
  //   "metadata": {
  //     "round": 1,
  //     "score_x": 0,
  //     "score_o": 0,
  //     "last_move_at": 1711054800 // Timestamp for timeout logic
  //   }
  // }

  return <div>Game {roomId}</div>;
};

export default Game;
