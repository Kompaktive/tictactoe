import type { Marker } from "~/types/game";
import OMarker from "../atoms/icons/OMarker";
import XMarker from "../atoms/icons/XMarker";
import { cn } from "~/utils/cn";

type Props = {
  marker: Marker;
  nickname: string;
  rtl?: boolean;
  highlight?: boolean;
};

const PlayerCard = ({ nickname, marker, rtl, highlight }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 truncate rounded-xl border p-1 transition duration-100",
        rtl && "flex-row-reverse",
        highlight ? "border-accent-1" : "border-transparent",
      )}
    >
      {marker === "o" ? (
        <OMarker className="size-8 shrink md:size-16" />
      ) : (
        <XMarker className="size-8 shrink md:size-16" />
      )}
      <span className="truncate text-white">{nickname}</span>
    </div>
  );
};

export default PlayerCard;
