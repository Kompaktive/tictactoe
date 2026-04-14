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
export type TicTacToeBoardState = [
  Marker, Marker, Marker,
  Marker, Marker, Marker,
  Marker, Marker, Marker,
]

export type GameSession = {
  active_player: Marker;
  board: TicTacToeBoardState;
  host_name: string;
  host_marker: Marker;
  guest_name: string;
  round: number;
  score_host: number;
  score_guest: number;
  status: "ongoing" | "completed";
};
