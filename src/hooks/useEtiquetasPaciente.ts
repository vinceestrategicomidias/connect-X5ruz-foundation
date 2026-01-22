import { useState, useMemo } from "react";

export interface EtiquetaPaciente {
  id: string;
  nome: string;
  cor: string;
}

export interface HistoricoEtiqueta {
  id: string;
  etiqueta: EtiquetaPaciente;
  dataAtribuicao: string;
  atribuidoPor: string;
}

// Mock de etiquetas disponíveis
export const etiquetasDisponiveis: EtiquetaPaciente[] = [
  { id: "1", nome: "VIP", cor: "#9333EA" },
  { id: "2", nome: "Negociação", cor: "#F59E0B" },
  { id: "3", nome: "Proposta Enviada", cor: "#3B82F6" },
  { id: "4", nome: "Primeira Consulta", cor: "#10B981" },
  { id: "5", nome: "Retorno", cor: "#6366F1" },
  { id: "6", nome: "Convênio", cor: "#EC4899" },
  { id: "7", nome: "Particular", cor: "#14B8A6" },
  { id: "8", nome: "Urgente", cor: "#EF4444" },
];

// Mock de etiquetas por paciente
const etiquetasPorPaciente: Record<string, EtiquetaPaciente[]> = {
  // Lúcia Fernandes - VIP + Negociação
  "lucia": [
    { id: "1", nome: "VIP", cor: "#9333EA" },
    { id: "2", nome: "Negociação", cor: "#F59E0B" },
  ],
  // Vanessa Costa - Proposta Enviada
  "vanessa": [
    { id: "3", nome: "Proposta Enviada", cor: "#3B82F6" },
    { id: "6", nome: "Convênio", cor: "#EC4899" },
  ],
  // Pedro Henrique - Primeira Consulta + Particular
  "pedro": [
    { id: "4", nome: "Primeira Consulta", cor: "#10B981" },
    { id: "7", nome: "Particular", cor: "#14B8A6" },
  ],
  // Carla Mendes - VIP + Proposta Enviada + Retorno
  "carla": [
    { id: "1", nome: "VIP", cor: "#9333EA" },
    { id: "3", nome: "Proposta Enviada", cor: "#3B82F6" },
    { id: "5", nome: "Retorno", cor: "#6366F1" },
  ],
  // Fernando Almeida - Urgente + Negociação
  "fernando": [
    { id: "8", nome: "Urgente", cor: "#EF4444" },
    { id: "2", nome: "Negociação", cor: "#F59E0B" },
  ],
};

// Mock de histórico de etiquetas por paciente
const historicoEtiquetasPorPaciente: Record<string, HistoricoEtiqueta[]> = {
  "lucia": [
    { 
      id: "h1", 
      etiqueta: { id: "1", nome: "VIP", cor: "#9333EA" },
      dataAtribuicao: "2025-12-15T10:30:00",
      atribuidoPor: "Geovana"
    },
    { 
      id: "h2", 
      etiqueta: { id: "2", nome: "Negociação", cor: "#F59E0B" },
      dataAtribuicao: "2026-01-10T14:22:00",
      atribuidoPor: "Paloma"
    },
  ],
  "vanessa": [
    { 
      id: "h3", 
      etiqueta: { id: "4", nome: "Primeira Consulta", cor: "#10B981" },
      dataAtribuicao: "2025-11-20T09:15:00",
      atribuidoPor: "Emilly"
    },
    { 
      id: "h4", 
      etiqueta: { id: "3", nome: "Proposta Enviada", cor: "#3B82F6" },
      dataAtribuicao: "2025-12-05T16:45:00",
      atribuidoPor: "Geovana"
    },
    { 
      id: "h5", 
      etiqueta: { id: "6", nome: "Convênio", cor: "#EC4899" },
      dataAtribuicao: "2025-12-10T11:30:00",
      atribuidoPor: "Paloma"
    },
  ],
  "pedro": [
    { 
      id: "h6", 
      etiqueta: { id: "4", nome: "Primeira Consulta", cor: "#10B981" },
      dataAtribuicao: "2026-01-18T08:00:00",
      atribuidoPor: "Bianca"
    },
    { 
      id: "h7", 
      etiqueta: { id: "7", nome: "Particular", cor: "#14B8A6" },
      dataAtribuicao: "2026-01-18T08:05:00",
      atribuidoPor: "Bianca"
    },
  ],
  "carla": [
    { 
      id: "h8", 
      etiqueta: { id: "5", nome: "Retorno", cor: "#6366F1" },
      dataAtribuicao: "2025-10-02T13:20:00",
      atribuidoPor: "Marcos"
    },
    { 
      id: "h9", 
      etiqueta: { id: "1", nome: "VIP", cor: "#9333EA" },
      dataAtribuicao: "2025-11-15T10:00:00",
      atribuidoPor: "Geovana"
    },
    { 
      id: "h10", 
      etiqueta: { id: "3", nome: "Proposta Enviada", cor: "#3B82F6" },
      dataAtribuicao: "2026-01-05T15:30:00",
      atribuidoPor: "Paloma"
    },
  ],
  "fernando": [
    { 
      id: "h11", 
      etiqueta: { id: "8", nome: "Urgente", cor: "#EF4444" },
      dataAtribuicao: "2026-01-20T09:00:00",
      atribuidoPor: "Emilly"
    },
    { 
      id: "h12", 
      etiqueta: { id: "2", nome: "Negociação", cor: "#F59E0B" },
      dataAtribuicao: "2026-01-21T11:15:00",
      atribuidoPor: "Geovana"
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

export const useEtiquetasPaciente = (pacienteId?: string, pacienteNome?: string) => {
  const pacienteKey = pacienteNome ? getPacienteKeyFromNome(pacienteNome) : "";
  
  const etiquetas = useMemo(() => {
    return etiquetasPorPaciente[pacienteKey] || [];
  }, [pacienteKey]);

  const historicoEtiquetas = useMemo(() => {
    return (historicoEtiquetasPorPaciente[pacienteKey] || [])
      .sort((a, b) => new Date(b.dataAtribuicao).getTime() - new Date(a.dataAtribuicao).getTime());
  }, [pacienteKey]);

  return {
    etiquetas,
    historicoEtiquetas,
    etiquetasDisponiveis,
    isLoading: false,
  };
};
