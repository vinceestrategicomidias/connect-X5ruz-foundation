import { useMemo, useState, useEffect } from "react";

export interface MensagemFavoritada {
  id: string;
  texto: string;
  autor: "paciente" | "atendente";
  horario: string;
  dataFavorito: string;
  favoritadoPor: string;
  nota?: string;
  opcaoFavorito: "historico" | "nota";
  pacienteId?: string;
  pacienteNome?: string;
}

// Mock de mensagens favoritadas por paciente
const mensagensFavoritadasIniciais: Record<string, MensagemFavoritada[]> = {
  "lucia": [
    {
      id: "fav1",
      texto: "Gostaria de agendar uma consulta para próxima semana, se possível na segunda-feira",
      autor: "paciente",
      horario: "14:32",
      dataFavorito: "2026-01-15T14:35:00",
      favoritadoPor: "Geovana",
      nota: "Paciente prefere segundas-feiras para consultas",
      opcaoFavorito: "nota"
    },
    {
      id: "fav2",
      texto: "O valor do procedimento ficou dentro do esperado, vou conversar com meu marido e retorno",
      autor: "paciente",
      horario: "16:45",
      dataFavorito: "2026-01-18T16:50:00",
      favoritadoPor: "Paloma",
      opcaoFavorito: "historico"
    },
  ],
  "vanessa": [
    {
      id: "fav3",
      texto: "Confirmo interesse no plano premium, podem enviar o contrato?",
      autor: "paciente",
      horario: "10:22",
      dataFavorito: "2026-01-10T10:25:00",
      favoritadoPor: "Emilly",
      nota: "Paciente confirmou interesse - encaminhar contrato",
      opcaoFavorito: "nota"
    },
  ],
  "pedro": [
    {
      id: "fav4",
      texto: "Estou com dúvidas sobre as formas de pagamento disponíveis",
      autor: "paciente",
      horario: "09:15",
      dataFavorito: "2026-01-20T09:18:00",
      favoritadoPor: "Bianca",
      opcaoFavorito: "historico"
    },
  ],
  "carla": [
    {
      id: "fav5",
      texto: "Preciso remarcar a consulta da próxima semana para quinta-feira",
      autor: "paciente",
      horario: "11:30",
      dataFavorito: "2026-01-12T11:32:00",
      favoritadoPor: "Geovana",
      nota: "Remarcação solicitada - preferência por quintas",
      opcaoFavorito: "nota"
    },
    {
      id: "fav6",
      texto: "Adorei o atendimento da última vez, vocês são muito atenciosos!",
      autor: "paciente",
      horario: "15:20",
      dataFavorito: "2026-01-19T15:22:00",
      favoritadoPor: "Paloma",
      nota: "Feedback positivo da paciente VIP",
      opcaoFavorito: "nota"
    },
  ],
  "fernando": [
    {
      id: "fav7",
      texto: "É urgente! Preciso resolver isso hoje se possível",
      autor: "paciente",
      horario: "08:45",
      dataFavorito: "2026-01-21T08:48:00",
      favoritadoPor: "Emilly",
      nota: "Caso urgente - priorizar atendimento",
      opcaoFavorito: "nota"
    },
  ],
};

const getPacienteKeyFromNome = (nome: string): string => {
  const nomeNormalizado = nome.toLowerCase();
  if (nomeNormalizado.includes("lúcia") || nomeNormalizado.includes("lucia")) return "lucia";
  if (nomeNormalizado.includes("vanessa")) return "vanessa";
  if (nomeNormalizado.includes("pedro")) return "pedro";
  if (nomeNormalizado.includes("carla")) return "carla";
  if (nomeNormalizado.includes("fernando")) return "fernando";
  return "";
};

// Global store for favorited messages (shared across components)
let favoritadasStore: Record<string, MensagemFavoritada[]> = { ...mensagensFavoritadasIniciais };
let storeListeners: Array<() => void> = [];

const notifyListeners = () => {
  storeListeners.forEach((listener) => listener());
};

export const adicionarMensagemFavoritada = (
  pacienteId: string,
  pacienteNome: string,
  mensagem: {
    id: string;
    texto: string;
    autor: "paciente" | "atendente";
    horario: string;
  },
  opcao: "historico" | "nota",
  nota?: string,
  favoritadoPor?: string
) => {
  const key = getPacienteKeyFromNome(pacienteNome) || pacienteId;

  const novaFavoritada: MensagemFavoritada = {
    id: `fav-${Date.now()}-${mensagem.id}`,
    texto: mensagem.texto,
    autor: mensagem.autor as "paciente" | "atendente",
    horario: mensagem.horario,
    dataFavorito: new Date().toISOString(),
    favoritadoPor: favoritadoPor || "Você",
    nota,
    opcaoFavorito: opcao,
    pacienteId,
    pacienteNome,
  };

  favoritadasStore = {
    ...favoritadasStore,
    [key]: [novaFavoritada, ...(favoritadasStore[key] || [])],
  };

  notifyListeners();
};

export const useMensagensFavoritadas = (pacienteId?: string, pacienteNome?: string) => {
  const pacienteKey = pacienteNome ? getPacienteKeyFromNome(pacienteNome) : "";
  const [tick, setTick] = useState(0);

  // Subscribe to store changes
  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    storeListeners.push(listener);
    return () => {
      storeListeners = storeListeners.filter((l) => l !== listener);
    };
  }, []);

  const mensagensFavoritadas = useMemo(() => {
    const key = pacienteKey || pacienteId || "";
    return (favoritadasStore[key] || [])
      .sort((a, b) => new Date(b.dataFavorito).getTime() - new Date(a.dataFavorito).getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteKey, pacienteId, tick]);

  return {
    mensagensFavoritadas,
    isLoading: false,
  };
};
