import { useState, useEffect, useCallback } from "react";
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

// Initial notifications pool
const initialNotifications: Omit<Notification, "id">[] = [
  {
    type: "transferencia_recebida",
    title: "Nova transferência recebida",
    description: "Você recebeu o paciente Ana Cristina do setor Pré-venda.",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
    read: false,
    referenciaId: "AT-10231",
    acao: "abrir_chat",
  },
  {
    type: "nps_recebido",
    title: "Novo NPS: 10",
    description: "Paciente avaliou seu atendimento com nota 10. Excelente trabalho!",
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 min ago
    read: false,
    referenciaId: "NPS-5587",
    acao: "abrir_painel_nps",
  },
  {
    type: "ligacao_perdida",
    title: "Ligação perdida",
    description: "Paciente João Silva tentou ligar e a ligação não foi atendida.",
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 min ago
    read: true,
    referenciaId: "CALL-33021",
    acao: "abrir_chamada",
  },
  {
    type: "reconhecimento_semana",
    title: "Reconhecimento da semana",
    description: "Parabéns! Você está entre os destaques de produtividade da semana.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 min ago
    read: false,
    referenciaId: "REC-2025-11-SEM4",
    acao: "abrir_painel_feedback",
  },
];

// Notification templates for simulation
const notificationTemplates: Omit<Notification, "id" | "timestamp">[] = [
  {
    type: "alerta_performance",
    title: "Paciente muito tempo sem resposta",
    description: "O paciente Maria Eduarda está há 18 minutos sem resposta. Verifique o atendimento.",
    read: false,
    acao: "abrir_chat",
  },
  {
    type: "alerta_performance",
    title: "Fila em alta",
    description: "O setor Pré-venda está com 9 pacientes aguardando acima de 10 minutos.",
    read: false,
    acao: "abrir_alertas",
  },
  {
    type: "ligacao_perdida",
    title: "Ligação perdida do paciente",
    description: "O paciente Carlos Alberto tentou contato por telefone e a ligação caiu.",
    read: false,
    acao: "abrir_chamada",
  },
  {
    type: "nps_recebido",
    title: "Novo NPS recebido",
    description: "Você recebeu um NPS 8 no atendimento de hoje (paciente Luana).",
    read: false,
    acao: "abrir_painel_nps",
  },
  {
    type: "feedback_ia",
    title: "Sugestão da IA",
    description: "A IA recomenda priorizar atendimentos com mais de 15 minutos na fila.",
    read: false,
    acao: "abrir_painel_feedback",
  },
  {
    type: "reconhecimento_semana",
    title: "Destaque do turno",
    description: "Você está entre os 3 atendentes com maior produtividade neste turno.",
    read: false,
    acao: "abrir_painel_feedback",
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // Mock user ID para protótipo (Geovana)
  const MOCK_USER_ID = "11111111-1111-1111-1111-111111111111";
  const [userId, setUserId] = useState<string | null>(MOCK_USER_ID);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const notificationSimulationEnabled = true; // Sempre ativo no protótipo

  // Set mock user ID for prototype
  useEffect(() => {
    setUserId(MOCK_USER_ID);
  }, []);

  // Load initial demo notifications
  useEffect(() => {
    if (!userId) return;

    const loadInitialNotifications = async () => {
      // Check if there are existing notifications
      const { data: existing } = await supabase
        .from("notificacoes")
        .select("id")
        .eq("usuario_destino_id", userId)
        .limit(1);

      // Only add initial notifications if none exist
      if (!existing || existing.length === 0) {
        const notificationsToInsert = initialNotifications.map((notif) => ({
          usuario_destino_id: userId,
          tipo: notif.type,
          titulo: notif.title,
          mensagem: notif.description,
          data_hora: notif.timestamp,
          lida: notif.read,
          referencia_id: notif.referenciaId,
          acao: notif.acao,
        }));

        const { error } = await supabase.from("notificacoes").insert(notificationsToInsert);
        if (error) {
          console.error("Erro ao inserir notificações iniciais:", error);
        }
      }

      setInitialLoaded(true);
    };

    if (!initialLoaded) {
      loadInitialNotifications();
    }
  }, [userId, initialLoaded]);

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
  }, [userId, initialLoaded]);

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

  // Simulate new notifications every 2 minutes (for demo purposes)
  const addSimulatedNotification = useCallback(async () => {
    if (!userId || !notificationSimulationEnabled) return;

    // Pick a random template
    const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
    
    const newNotification = {
      usuario_destino_id: userId,
      tipo: template.type,
      titulo: template.title,
      mensagem: template.description,
      data_hora: new Date().toISOString(),
      lida: false,
      acao: template.acao,
    };

    const { error } = await supabase
      .from("notificacoes")
      .insert([newNotification]);

    if (error) {
      console.error("Erro ao inserir notificação simulada:", error);
    }
  }, [userId, notificationSimulationEnabled]);

  useEffect(() => {
    if (!notificationSimulationEnabled || !userId) return;

    // Simulate notifications every 1 minute (60 seconds)
    const interval = setInterval(() => {
      addSimulatedNotification();
    }, 60000);

    return () => clearInterval(interval);
  }, [notificationSimulationEnabled, userId, addSimulatedNotification]);

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
