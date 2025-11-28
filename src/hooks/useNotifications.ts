import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

export type NotificationType = 
  | "transferencia_recebida"
  | "reconhecimento_semana"
  | "ligacao_perdida"
  | "nps_recebido"
  | "alerta_performance"
  | "ideia_aprovada"
  | "feedback_ia";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  referenciaId?: string;
  acao?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("usuario_destino_id", userId)
        .order("data_hora", { ascending: false });

      if (error) {
        console.error("Erro ao buscar notificações:", error);
        return;
      }

      if (data) {
        const mapped = data.map((n: Tables<"notificacoes">) => ({
          id: n.id,
          type: n.tipo as NotificationType,
          title: n.titulo,
          description: n.mensagem,
          timestamp: n.data_hora,
          read: n.lida,
          referenciaId: n.referencia_id || undefined,
          acao: n.acao || undefined,
        }));
        setNotifications(mapped);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notificacoes_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificacoes",
          filter: `usuario_destino_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Tables<"notificacoes">;
          const notification: Notification = {
            id: newNotif.id,
            type: newNotif.tipo as NotificationType,
            title: newNotif.titulo,
            description: newNotif.mensagem,
            timestamp: newNotif.data_hora,
            read: newNotif.lida,
            referenciaId: newNotif.referencia_id || undefined,
            acao: newNotif.acao || undefined,
          };

          setNotifications((prev) => [notification, ...prev]);

          // Push notification toast
          toast({
            title: notification.title,
            description: notification.description,
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Update unread count
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const markAsRead = async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("id", id)
      .eq("usuario_destino_id", userId);

    if (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("usuario_destino_id", userId)
      .eq("lida", false);

    if (error) {
      console.error("Erro ao marcar todas como lidas:", error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Execute action based on notification type
    switch (notification.acao) {
      case "abrir_chat":
        console.log("Abrir conversa:", notification.referenciaId);
        // TODO: Navigate to chat with patient
        break;
      case "abrir_painel_feedback":
        console.log("Abrir painel de feedback");
        // TODO: Open feedback panel
        break;
      case "abrir_chamada":
        console.log("Abrir detalhes da ligação:", notification.referenciaId);
        // TODO: Open call details
        break;
      case "abrir_painel_nps":
        console.log("Abrir NPS:", notification.referenciaId);
        // TODO: Open NPS panel
        break;
      case "abrir_alertas":
        console.log("Abrir alertas");
        // TODO: Open alerts panel
        break;
      case "abrir_painel_ideias":
        console.log("Abrir painel de ideias");
        // TODO: Open ideas panel
        break;
      default:
        console.log("Ação não definida para:", notification.type);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    handleNotificationClick,
  };
};
