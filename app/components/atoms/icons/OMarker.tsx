import type { ComponentProps } from "react";
import { cn } from "~/utils/cn";

const OMarker = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={cn("stroke-accent-2 fill-none stroke-12", className)}
      {...props}
    >
      <circle cx="50" cy="50" r="35" />
    </svg>
  );
};

export default OMarker;
