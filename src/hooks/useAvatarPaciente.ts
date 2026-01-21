import { useState, useEffect, useCallback } from "react";

// Cache de avatares gerados em memória (simples para protótipo)
const avatarCache = new Map<string, string>();

// Avatares pré-definidos para demonstração (usando UI Avatars API para gerar automaticamente)
const avataresPredefinidos: Record<string, string> = {};

// Função para gerar URL de avatar baseado no nome
const gerarAvatarUrl = (nome: string): string => {
  // Determinar gênero baseado no nome
  const genero = inferirGenero(nome);
  
  // Usar diferentes seeds baseados no nome para variedade
  const seed = hashString(nome);
  
  // Cores baseadas no gênero e variação
  const coresFemininas = ["f472b6", "ec4899", "a855f7", "8b5cf6", "f87171", "fb923c"];
  const coresMasculinas = ["3b82f6", "06b6d4", "10b981", "6366f1", "14b8a6", "0ea5e9"];
  
  const cores = genero === "feminino" ? coresFemininas : coresMasculinas;
  const corSelecionada = cores[Math.abs(seed) % cores.length];
  
  // UI Avatars gera avatares bonitos baseados em iniciais
  const iniciais = nome.split(" ").map(n => n[0]).join("").slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=${corSelecionada}&color=fff&size=128&bold=true&format=svg`;
};

// Hash simples para gerar número baseado em string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

// Inferir gênero baseado no nome
const inferirGenero = (nome: string): "feminino" | "masculino" => {
  const primeiroNome = nome.split(" ")[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const nomesFemininos = [
    "maria", "ana", "julia", "lucia", "vanessa", "patricia", "fernanda", "amanda",
    "camila", "bruna", "larissa", "beatriz", "carolina", "mariana", "gabriela",
    "leticia", "aline", "juliana", "adriana", "paula", "sandra", "monica", "renata",
    "simone", "carla", "denise", "cristina", "rosa", "helena", "tereza", "teresa",
    "francisca", "antonia", "vitoria", "isabela", "sophia", "sofia", "laura",
    "emilly", "emily", "geovana", "giovana", "paloma", "bianca"
  ];
  
  if (nomesFemininos.includes(primeiroNome)) {
    return "feminino";
  }
  
  // Heurística: nomes terminados em 'a' geralmente são femininos
  if (primeiroNome.endsWith("a")) {
    return "feminino";
  }
  
  return "masculino";
};

export const useAvatarPaciente = () => {
  const getAvatar = useCallback((nome: string): string => {
    // Verificar cache primeiro
    if (avatarCache.has(nome)) {
      return avatarCache.get(nome)!;
    }
    
    // Verificar avatares pré-definidos
    if (avataresPredefinidos[nome]) {
      return avataresPredefinidos[nome];
    }
    
    // Gerar URL de avatar
    const avatarUrl = gerarAvatarUrl(nome);
    avatarCache.set(nome, avatarUrl);
    
    return avatarUrl;
  }, []);

  return { getAvatar };
};

// Hook para gerar avatar usando IA (opcional, para uso futuro)
export const useGerarAvatarIA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarsGerados, setAvatarsGerados] = useState<Map<string, string>>(new Map());

  const gerarAvatar = async (nome: string): Promise<string | null> => {
    // Placeholder - integração com IA será feita posteriormente
    return null;
  };

  return {
    gerarAvatar,
    isLoading,
    avatarsGerados,
  };
};
