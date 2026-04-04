export type Player = {
  nickname: string;
  uid: string;
};

export type Pairing = {
  host: Player;
  guest?: Player | null;
};

export type Marker = "o" | "x" | "";

// prettier-ignore
export type TicTacToeBoard = [
  Marker, Marker, Marker,
  Marker, Marker, Marker,
  Marker, Marker, Marker,
]

export type GameSession = {
  active_player: Marker;
  board: TicTacToeBoard;
  last_move_at: number; // Date timestamp in millisecond
  player_o_name: string;
  player_x_name: string;
  round: number;
  score_o: number;
  score_x: number;
  status: "ongoing" | "completed";
};
