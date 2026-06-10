import type { Marker } from "~/types/game";
import PlayerCard from "../molecules/PlayerCard";
import OMarker from "../atoms/icons/OMarker";
import XMarker from "../atoms/icons/XMarker";

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
    <section className="font-google grid grid-cols-3 gap-2">
      <div className="bg-secondary col-span-3 flex items-center justify-between gap-4 rounded-xl p-2">
        <PlayerCard marker={host.marker} nickname={host.nickname} />
        <span className="text-24 md:text-32 font-bold text-white">vs</span>
        <PlayerCard marker={guest.marker} nickname={guest.nickname} rtl />
      </div>

      <div className="bg-secondary text-32 flex items-center justify-center rounded-xl p-2 font-bold">
        {host.score}
      </div>
      <div className="bg-secondary flex flex-col items-center justify-center rounded-xl p-2">
        <span className="block">Round</span>
        <span className="text-24 block font-medium">{round}</span>
      </div>
      <div className="bg-secondary text-32 flex items-center justify-center rounded-xl p-2 font-bold">
        {guest.score}
      </div>
    </section>
    // <section className="space-y-2">
    //   <div className="grid grid-cols-3 gap-x-2">
    //     <PlayerCard marker={host.marker} nickname={host.nickname} />

    //     <div className="bg-secondary flex flex-col justify-center rounded-xl p-2 text-center text-white">
    //       <div className="text-20">round {round}</div>

    //       <div className="text-32 flex grow items-center justify-center">
    //         <span className="block">
    //           {host.score} - {guest.score}
    //         </span>
    //       </div>
    //     </div>

    //     <PlayerCard marker={guest.marker} nickname={guest.nickname} />
    //   </div>
    // </section>
  );
};

export default Scoreboard;
