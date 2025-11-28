import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ConnectContainerProps {
  children: ReactNode;
  className?: string;
}

export const ConnectContainer = ({ children, className }: ConnectContainerProps) => {
  return (
    <div className={cn("w-full h-full bg-background", className)}>
      {children}
    </div>
  );
};
