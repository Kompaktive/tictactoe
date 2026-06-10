import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "~/utils/cn";
import OMarker from "./OMarker";
import XMarker from "./XMarker";

export const TicTacToeIcon = ({
  className,
  ...props
}: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      className={cn(
        "pointer-events-none grid grid-cols-2 select-none",
        className,
      )}
      {...props}
    >
      <div className="border-r border-b">
        <XMarker className="stroke-accent-1 animate-pulse" />
      </div>
      <div>
        <OMarker className="stroke-accent-2 animate-pulse border-b border-l [animation-delay:1000ms]" />
      </div>
      <div>
        <OMarker className="stroke-accent-2 animate-pulse border-t border-r [animation-delay:500ms]" />
      </div>
      <div>
        <XMarker className="stroke-accent-1 animate-pulse border-t border-l [animation-delay:1500ms]" />
      </div>
    </motion.div>
  );
};
