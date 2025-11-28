import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ConnectIconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  tooltip?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  disabled?: boolean;
}

export const ConnectIconButton = ({
  icon: Icon,
  onClick,
  tooltip,
  variant = "outline",
  disabled = false,
}: ConnectIconButtonProps) => {
  const button = (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="connect-transition"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
