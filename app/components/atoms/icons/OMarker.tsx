import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "~/utils/cn";

type OMarkerProps = {
  enableAnimation?: boolean;
} & ComponentProps<"svg">;

const OMarker = ({ enableAnimation, className, ...props }: OMarkerProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={cn("stroke-accent-2 origin-center", className)}
      {...props}
    >
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        strokeWidth={12}
        strokeLinecap="round"
        initial={enableAnimation && { pathLength: 0, rotate: -90 }}
        animate={
          enableAnimation && {
            pathLength: 1,
            transition: {
              pathLength: {
                type: "spring",
                duration: 0.4,
              },
            },
          }
        }
      />
    </svg>
  );
};

export default OMarker;
