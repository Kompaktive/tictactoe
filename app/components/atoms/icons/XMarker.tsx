import type { ComponentProps } from "react";
import { cn } from "~/utils/cn";

const XMarker = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={cn("stroke-white stroke-12 [stroke-linecap:butt]", className)}
      {...props}
    >
      <line x1="20" y1="20" x2="80" y2="80" />

      <line x1="80" y1="20" x2="20" y2="80" />
    </svg>
  );
};

export default XMarker;
