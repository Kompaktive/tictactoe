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
        "bg-accent-2 text-primary w-full rounded-xl p-4 font-medium hover:cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
