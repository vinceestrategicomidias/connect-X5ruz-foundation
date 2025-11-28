import { cn } from "@/lib/utils";

interface ThaliAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  processing?: boolean;
}

export const ThaliAvatar = ({ size = "md", className, processing = false }: ThaliAvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-display font-bold text-primary-foreground shadow-md",
        sizeClasses[size],
        processing && "animate-breathe",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-3/5 h-3/5"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M2 17L12 22L22 17M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
      </svg>
    </div>
  );
};
