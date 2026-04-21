import type { Marker } from "~/types/game";

type Props = {
  nickname: string;
  marker: Marker;
  score: number;
};

const PlayerCard = ({ nickname, marker, score }: Props) => {
  return (
    <div className="bg-dark rounded-xl p-2 text-center text-white">
      <div>{nickname}</div>
      <div>{marker}</div>
      <div>{score}</div>
    </div>
  );
};

export default PlayerCard;
