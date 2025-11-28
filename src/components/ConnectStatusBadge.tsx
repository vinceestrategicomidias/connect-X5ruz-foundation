import { Badge } from "@/components/ui/badge";

interface ConnectStatusBadgeProps {
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
}

export const ConnectStatusBadge = ({ status }: ConnectStatusBadgeProps) => {
  const statusConfig = {
    online: {
      label: "Online",
      variant: "default" as const,
      className: "bg-success text-success-foreground",
    },
    offline: {
      label: "Offline",
      variant: "secondary" as const,
      className: "",
    },
    espera: {
      label: "Em Espera",
      variant: "default" as const,
      className: "bg-warning text-warning-foreground",
    },
    andamento: {
      label: "Em Andamento",
      variant: "default" as const,
      className: "bg-primary text-primary-foreground",
    },
    finalizado: {
      label: "Finalizado",
      variant: "secondary" as const,
      className: "",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};
