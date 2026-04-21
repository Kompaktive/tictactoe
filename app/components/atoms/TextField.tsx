import type { ComponentProps } from "react";
import { cn } from "~/utils/cn";

type Props = {
  className?: string;
} & ComponentProps<"input">;

const TextField = ({ className, ...prop }: Props) => {
  return (
    <input
      type="text"
      className={cn(
        "bg-dark rounded-lg px-3 py-2 text-white focus:outline-0",
        className,
      )}
      {...prop}
    />
  );
};

export default TextField;
