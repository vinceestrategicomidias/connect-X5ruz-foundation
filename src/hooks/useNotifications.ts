import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type NotificationType = 
  | "transferencia_recebida"
  | "reconhecimento_semana"
  | "ligacao_perdida"
  | "nps_recebido"
  | "alerta_performance"
  | "ideia_aprovada";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  actionData?: any;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "transferencia_recebida",
    title: "Transferência Recebida",
    description: "Maria Silva transferiu o paciente João Santos para você",
    timestamp: new Date().toISOString(),
    read: false,
    avatar: undefined,
  },
  {
    id: "2",
    type: "reconhecimento_semana",
    title: "Reconhecimento da Semana! 🏆",
    description: "Parabéns! Você foi destaque pela excelente qualidade no atendimento",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "ligacao_perdida",
    title: "Ligação Perdida",
    description: "Ana Paula tentou ligar mas não conseguiu completar a chamada",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Simular notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular chegada de nova notificação aleatoriamente (5% de chance a cada 10s)
      if (Math.random() < 0.05) {
        const newNotification: Notification = {
          id: `notif_${Date.now()}`,
          type: "transferencia_recebida",
          title: "Nova Transferência",
          description: "Você recebeu um novo paciente transferido",
          timestamp: new Date().toISOString(),
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Exibir toast push
        toast({
          title: newNotification.title,
          description: newNotification.description,
          duration: 5000,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case "transferencia_recebida":
        // Abrir conversa do paciente transferido
        console.log("Abrir conversa:", notification.actionData);
        break;
      case "reconhecimento_semana":
        // Abrir painel de feedback
        console.log("Abrir painel de feedback");
        break;
      case "ligacao_perdida":
        // Mostrar card com opções
        console.log("Abrir detalhes da ligação perdida");
        break;
      case "nps_recebido":
        // Abrir detalhes do NPS
        console.log("Abrir NPS");
        break;
      case "alerta_performance":
        // Abrir painel de alertas
        console.log("Abrir alertas");
        break;
      case "ideia_aprovada":
        // Abrir aba de ideias
        console.log("Abrir ideias");
        break;
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
