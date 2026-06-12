import type { ComponentProps, PropsWithChildren } from "react";
import { cn } from "~/utils/cn";

type Props = {
  className?: string;
} & ComponentProps<"button">;

const Button = ({
  className,
  children,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <button
      type="button"
      className={cn(
        "bg-accent-1 disabled:bg-secondary hover:bg-accent-2 text-primary w-full rounded-xl p-4 font-medium transition duration-150 hover:cursor-pointer disabled:cursor-default",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
