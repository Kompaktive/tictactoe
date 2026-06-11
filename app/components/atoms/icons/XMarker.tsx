import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { cn } from "~/utils/cn";

type XMarkerProps = {
  enableAnimation?: boolean;
} & ComponentProps<"svg">;

const XMarker = ({ enableAnimation, className, ...props }: XMarkerProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={cn(
        "stroke-accent-1 stroke-12 [stroke-linecap:butt]",
        className,
      )}
      {...props}
    >
      <motion.line
        x1="20"
        y1="20"
        x2="80"
        y2="80"
        initial={enableAnimation && { pathLength: 0 }}
        animate={
          enableAnimation && {
            pathLength: 1,
            transition: {
              pathLength: {
                type: "spring",
                duration: 0.2,
              },
            },
          }
        }
      />
      <motion.line
        x1="80"
        y1="20"
        x2="20"
        y2="80"
        initial={enableAnimation && { pathLength: 0 }}
        animate={
          enableAnimation && {
            pathLength: 1,
            transition: {
              pathLength: {
                delay: 0.1,
                type: "spring",
                duration: 0.2,
              },
            },
          }
        }
      />
    </svg>
  );
};

export default XMarker;
