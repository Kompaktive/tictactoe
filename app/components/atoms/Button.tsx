import type { ComponentProps, PropsWithChildren } from "react";
import { cn } from "~/helpers/cn";

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
        "bg-dark text-background rounded-xl p-4 hover:cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
