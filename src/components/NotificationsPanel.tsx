import { Bell, Check, ArrowRightLeft, Trophy, PhoneMissed, Star, AlertTriangle, Lightbulb, Brain } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const getNotificationIcon = (type: Notification["type"]) => {
  const iconClass = "h-5 w-5";
  
  switch (type) {
    case "transferencia_recebida":
      return <ArrowRightLeft className={cn(iconClass, "text-blue-500")} />;
    case "reconhecimento_semana":
      return <Trophy className={cn(iconClass, "text-yellow-500")} />;
    case "ligacao_perdida":
      return <PhoneMissed className={cn(iconClass, "text-red-500")} />;
    case "nps_recebido":
      return <Star className={cn(iconClass, "text-amber-500")} />;
    case "alerta_performance":
      return <AlertTriangle className={cn(iconClass, "text-orange-500")} />;
    case "ideia_aprovada":
      return <Lightbulb className={cn(iconClass, "text-green-500")} />;
    case "feedback_ia":
      return <Brain className={cn(iconClass, "text-purple-500")} />;
    default:
      return <Bell className={cn(iconClass, "text-muted-foreground")} />;
  }
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const now = new Date();
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const lastWeek: Notification[] = [];

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.timestamp);
    const diffInDays = Math.floor(
      (now.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
      today.push(notif);
    } else if (diffInDays === 1) {
      yesterday.push(notif);
    } else if (diffInDays <= 7) {
      lastWeek.push(notif);
    }
  });

  return { today, yesterday, lastWeek };
};

export const NotificationsPanel = () => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    handleNotificationClick,
  } = useNotifications();

  const { today, yesterday, lastWeek } = groupNotificationsByDate(notifications);

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <button
      onClick={() => handleNotificationClick(notification)}
      className={cn(
        "w-full flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors text-left border-b border-border/50 last:border-0",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center">
          {getNotificationIcon(notification.type)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground line-clamp-1">
            {notification.title}
          </p>
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1.5">
          {formatDistanceToNow(new Date(notification.timestamp), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>
    </button>
  );

  const NotificationSection = ({
    title,
    notifications,
  }: {
    title: string;
    notifications: Notification[];
  }) => {
    if (notifications.length === 0) return null;

    return (
      <div>
        <div className="sticky top-0 bg-muted/50 backdrop-blur-sm px-4 py-2 z-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div>
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notification={notif} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative connect-transition"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 shadow-xl"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Notificações</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} não {unreadCount === 1 ? "lida" : "lidas"}
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8"
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[520px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Bell className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-semibold text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Você está em dia com tudo!
              </p>
            </div>
          ) : (
            <div>
              <NotificationSection title="Hoje" notifications={today} />
              <NotificationSection title="Ontem" notifications={yesterday} />
              <NotificationSection
                title="Últimos 7 dias"
                notifications={lastWeek}
              />
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
