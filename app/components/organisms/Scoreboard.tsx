import { motion } from "motion/react";
import type { Marker } from "~/types/game";
import PlayerCard from "../molecules/PlayerCard";

type PlayerScore = {
  nickname: string;
  marker: Marker;
  score: number;
};

type Props = {
  round: number;
  currentTurn: Marker;
  host: PlayerScore;
  guest: PlayerScore;
};

const Scoreboard = ({ round, currentTurn, host, guest }: Props) => {
  return (
    <motion.section
      className="font-google grid grid-cols-3 gap-2"
      initial={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.5,
      }}
    >
      <div className="bg-secondary col-span-3 flex items-center justify-between gap-4 rounded-xl p-2">
        <PlayerCard
          marker={host.marker}
          nickname={host.nickname}
          highlight={currentTurn === host.marker}
        />
        <span className="text-20 md:text-32 font-medium text-white">vs</span>
        <PlayerCard
          marker={guest.marker}
          nickname={guest.nickname}
          highlight={currentTurn === guest.marker}
          rtl
        />
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
    </motion.section>
  );
};

export default Scoreboard;
