import type { Marker } from "~/types/game";
import OMarker from "../atoms/icons/OMarker";
import XMarker from "../atoms/icons/XMarker";

type Props = {
  marker: Marker;
  nickname: string;
};

const PlayerCard = ({ nickname, marker }: Props) => {
  return (
    <div className="bg-dark flex flex-col justify-between rounded-xl p-2 text-center text-white">
      <span className="text-20 block font-medium wrap-break-word">
        {nickname}
      </span>

      <div className="flex items-center justify-center">
        <div className="size-12">
          {marker === "x" ? <XMarker /> : <OMarker />}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
