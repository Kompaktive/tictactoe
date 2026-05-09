import type { Marker } from "~/types/game";
import PlayerCard from "../molecules/PlayerCard";

type PlayerScore = {
  nickname: string;
  marker: Marker;
  score: number;
};

type Props = {
  round: number;
  host: PlayerScore;
  guest: PlayerScore;
};

const Scoreboard = ({ round, host, guest }: Props) => {
  return (
    <section className="space-y-2">
      <div className="grid grid-cols-3 gap-x-2">
        <PlayerCard marker={host.marker} nickname={host.nickname} />

        <div className="bg-secondary flex flex-col justify-center rounded p-2 text-center text-white">
          <div className="text-20">round {round}</div>

          <div className="text-32 flex grow items-center justify-center">
            <span className="block">
              {host.score} - {guest.score}
            </span>
          </div>
        </div>

        <PlayerCard marker={guest.marker} nickname={guest.nickname} />
      </div>
    </section>
  );
};

export default Scoreboard;
