import type { Marker } from "~/types/game";
import OMarker from "../atoms/icons/OMarker";
import XMarker from "../atoms/icons/XMarker";
import { cn } from "~/utils/cn";

type Props = {
  marker: Marker;
  nickname: string;
  rtl?: boolean;
};

const PlayerCard = ({ nickname, marker, rtl }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-1 items-center gap-2 truncate",
        rtl && "flex-row-reverse",
      )}
    >
      {marker === "o" ? (
        <OMarker className="size-10 shrink-0 md:size-16" />
      ) : (
        <XMarker className="size-10 shrink-0 md:size-16" />
      )}
      <span className="truncate text-white">{nickname}</span>
    </div>
  );
};

export default PlayerCard;
