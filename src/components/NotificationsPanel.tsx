import { Bell, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getNotificationIcon = (type: Notification["type"]) => {
  const icons = {
    transferencia_recebida: "🔄",
    reconhecimento_semana: "🏆",
    ligacao_perdida: "📞",
    nps_recebido: "⭐",
    alerta_performance: "⚠️",
    ideia_aprovada: "💡",
  };
  return icons[type];
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
      className={`w-full flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors text-left ${
        !notification.read ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={notification.avatar} />
            <AvatarFallback>{notification.title[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
            {getNotificationIcon(notification.type)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {notification.title}
          </p>
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
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
        <div className="px-3 py-2 bg-muted/30">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
        <div className="divide-y divide-border">
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
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[380px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Notificações</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} não {unreadCount === 1 ? "lida" : "lidas"}
              </p>
            )}
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

        <ScrollArea className="h-[450px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Nenhuma notificação
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Você está em dia com tudo!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
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
