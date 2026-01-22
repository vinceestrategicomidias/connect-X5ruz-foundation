import { useState, useEffect, useRef } from "react";
import { X, Send, Users, Search, ChevronLeft, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectAvatar } from "./ConnectAvatar";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useSetores } from "@/hooks/useSetores";
import { cn } from "@/lib/utils";

interface Mensagem {
  id: string;
  de: string;
  para: string;
  texto: string;
  timestamp: Date;
  lida: boolean;
}

interface Conversa {
  id: string;
  participanteId: string;
  participanteNome: string;
  participanteAvatar?: string;
  participanteSetor?: string;
  ultimaMensagem: string;
  timestamp: Date;
  naoLidas: number;
  online: boolean;
}

interface ChatInternoPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modoGestao?: boolean;
}

// Dados simulados de conversas
const conversasSimuladas: Conversa[] = [
  {
    id: "1",
    participanteId: "att-1",
    participanteNome: "Paloma Ribeiro",
    participanteSetor: "Atendimento",
    ultimaMensagem: "Oi! Pode me ajudar com um paciente?",
    timestamp: new Date(Date.now() - 5 * 60000),
    naoLidas: 2,
    online: true,
  },
  {
    id: "2",
    participanteId: "att-2",
    participanteNome: "Emilly Santos",
    participanteSetor: "Vendas",
    ultimaMensagem: "Obrigada pela informação!",
    timestamp: new Date(Date.now() - 30 * 60000),
    naoLidas: 0,
    online: true,
  },
  {
    id: "3",
    participanteId: "att-3",
    participanteNome: "Marcos Silva",
    participanteSetor: "Suporte",
    ultimaMensagem: "Vou verificar aqui e te retorno",
    timestamp: new Date(Date.now() - 2 * 3600000),
    naoLidas: 1,
    online: false,
  },
];

const mensagensSimuladas: Record<string, Mensagem[]> = {
  "1": [
    { id: "m1", de: "att-1", para: "me", texto: "Oi Geo!", timestamp: new Date(Date.now() - 10 * 60000), lida: true },
    { id: "m2", de: "att-1", para: "me", texto: "Pode me ajudar com um paciente?", timestamp: new Date(Date.now() - 5 * 60000), lida: false },
  ],
  "2": [
    { id: "m3", de: "me", para: "att-2", texto: "O procedimento custa R$ 350", timestamp: new Date(Date.now() - 35 * 60000), lida: true },
    { id: "m4", de: "att-2", para: "me", texto: "Obrigada pela informação!", timestamp: new Date(Date.now() - 30 * 60000), lida: true },
  ],
  "3": [
    { id: "m5", de: "me", para: "att-3", texto: "Marcos, tem novidade sobre aquele caso?", timestamp: new Date(Date.now() - 3 * 3600000), lida: true },
    { id: "m6", de: "att-3", para: "me", texto: "Vou verificar aqui e te retorno", timestamp: new Date(Date.now() - 2 * 3600000), lida: false },
  ],
};

export const ChatInternoPanel = ({ open, onOpenChange, modoGestao = false }: ChatInternoPanelProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: atendentes } = useAtendentes();
  const { data: setores } = useSetores();
  
  const [conversas, setConversas] = useState<Conversa[]>(conversasSimuladas);
  const [conversaSelecionada, setConversaSelecionada] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaContato, setBuscaContato] = useState("");
  const [abaNova, setAbaNova] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversaSelecionada) {
      setMensagens(mensagensSimuladas[conversaSelecionada.id] || []);
      // Marcar como lidas
      setConversas(prev => prev.map(c => 
        c.id === conversaSelecionada.id ? { ...c, naoLidas: 0 } : c
      ));
    }
  }, [conversaSelecionada]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim() || !conversaSelecionada) return;

    const nova: Mensagem = {
      id: Date.now().toString(),
      de: "me",
      para: conversaSelecionada.participanteId,
      texto: novaMensagem,
      timestamp: new Date(),
      lida: false,
    };

    setMensagens(prev => [...prev, nova]);
    setConversas(prev => prev.map(c => 
      c.id === conversaSelecionada.id 
        ? { ...c, ultimaMensagem: novaMensagem, timestamp: new Date() }
        : c
    ));
    setNovaMensagem("");
  };

  const handleIniciarConversa = (atendente: any) => {
    const conversaExistente = conversas.find(c => c.participanteId === atendente.id);
    
    if (conversaExistente) {
      setConversaSelecionada(conversaExistente);
    } else {
      const novaConversa: Conversa = {
        id: Date.now().toString(),
        participanteId: atendente.id,
        participanteNome: atendente.nome,
        participanteAvatar: atendente.avatar,
        participanteSetor: setores?.find(s => s.id === atendente.setor_id)?.nome || "Sem setor",
        ultimaMensagem: "",
        timestamp: new Date(),
        naoLidas: 0,
        online: Math.random() > 0.5,
      };
      setConversas(prev => [novaConversa, ...prev]);
      setConversaSelecionada(novaConversa);
    }
    setAbaNova(false);
  };

  const formatarHora = (date: Date) => {
    const agora = new Date();
    const diff = agora.getTime() - date.getTime();
    
    if (diff < 60000) return "Agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const conversasFiltradas = conversas.filter(c => 
    c.participanteNome.toLowerCase().includes(busca.toLowerCase())
  );

  // Agrupar contatos por setor, com coordenadores primeiro
  const contatosFiltrados = atendentes?.filter(a => 
    a.id !== atendenteLogado?.id &&
    a.nome.toLowerCase().includes(buscaContato.toLowerCase())
  ) || [];

  // Ordenar: coordenadores/gestores primeiro, depois por nome
  const contatosOrdenados = [...contatosFiltrados].sort((a, b) => {
    const cargoOrdem = { gestor: 0, coordenacao: 1, atendente: 2 };
    const ordemA = cargoOrdem[a.cargo] ?? 2;
    const ordemB = cargoOrdem[b.cargo] ?? 2;
    if (ordemA !== ordemB) return ordemA - ordemB;
    return a.nome.localeCompare(b.nome);
  });

  const getCargoLabel = (cargo: string) => {
    switch (cargo) {
      case "gestor": return "Gestor";
      case "coordenacao": return "Coordenador(a)";
      default: return null;
    }
  };

  const totalNaoLidas = conversas.reduce((acc, c) => acc + c.naoLidas, 0);

  if (!open) return null;

  return (
    <Card className={cn(
      "fixed z-50 animate-fade-in bg-card shadow-xl border",
      modoGestao 
        ? "inset-4 rounded-xl" 
        : "bottom-20 right-6 w-96 h-[500px] rounded-xl"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          {conversaSelecionada && !modoGestao && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setConversaSelecionada(null)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <Users className="h-5 w-5 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="text-[9px] font-medium text-primary tracking-wide uppercase">Connect</span>
            <h3 className="font-semibold text-sm -mt-0.5">
              {modoGestao ? "Chat Interno" : "Chat da Equipe"}
            </h3>
          </div>
          {totalNaoLidas > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
              {totalNaoLidas}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className={cn("flex h-[calc(100%-56px)]", modoGestao && "h-[calc(100%-56px)]")}>
        {/* Lista de conversas - visível sempre no modo gestão ou quando não tem conversa selecionada */}
        {(modoGestao || !conversaSelecionada) && (
          <div className={cn(
            "flex flex-col border-r",
            modoGestao ? "w-80" : "w-full"
          )}>
            <Tabs defaultValue="conversas" className="flex-1 flex flex-col">
              <TabsList className="w-full grid grid-cols-2 m-2 mb-0">
                <TabsTrigger value="conversas" className="text-xs">Conversas</TabsTrigger>
                <TabsTrigger value="contatos" className="text-xs">Contatos</TabsTrigger>
              </TabsList>

              <TabsContent value="conversas" className="flex-1 m-0 p-2 overflow-hidden">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversa..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <ScrollArea className="h-[calc(100%-40px)] [&_[data-radix-scroll-area-scrollbar]]:w-1.5 [&_[data-radix-scroll-area-thumb]]:bg-primary/30 hover:[&_[data-radix-scroll-area-thumb]]:bg-primary/50">
                  <div className="space-y-1">
                    {conversasFiltradas.map(conversa => (
                      <div
                        key={conversa.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                          conversaSelecionada?.id === conversa.id 
                            ? "bg-primary/10" 
                            : "hover:bg-muted/50"
                        )}
                        onClick={() => setConversaSelecionada(conversa)}
                      >
                        <div className="relative">
                          <ConnectAvatar
                            name={conversa.participanteNome}
                            image={conversa.participanteAvatar}
                            size="sm"
                          />
                          <Circle
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-3 w-3",
                              conversa.online 
                                ? "fill-green-500 text-green-500" 
                                : "fill-muted text-muted"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-medium text-xs truncate">
                                {conversa.participanteNome}
                              </span>
                              {conversa.participanteSetor && (
                                <span className="text-[9px] text-muted-foreground shrink-0">
                                  • {conversa.participanteSetor}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                              {formatarHora(conversa.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-muted-foreground truncate">
                              {conversa.ultimaMensagem || "Nenhuma mensagem"}
                            </p>
                            {conversa.naoLidas > 0 && (
                              <Badge className="h-4 px-1 text-[9px] bg-primary">
                                {conversa.naoLidas}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {conversasFiltradas.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Nenhuma conversa encontrada
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="contatos" className="flex-1 m-0 p-2 overflow-hidden">
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar colega..."
                    value={buscaContato}
                    onChange={(e) => setBuscaContato(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <ScrollArea className="h-[calc(100%-40px)] [&_[data-radix-scroll-area-scrollbar]]:w-1.5 [&_[data-radix-scroll-area-thumb]]:bg-primary/30 hover:[&_[data-radix-scroll-area-thumb]]:bg-primary/50">
                  <div className="space-y-1">
                    {contatosOrdenados.map(atendente => {
                      const setorNome = atendente.setor_nome || setores?.find(s => s.id === atendente.setor_id)?.nome;
                      const cargoLabel = getCargoLabel(atendente.cargo);
                      const isCoordenadorOuGestor = atendente.cargo === "coordenacao" || atendente.cargo === "gestor";
                      
                      return (
                        <div
                          key={atendente.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                            isCoordenadorOuGestor && "bg-primary/5 border-l-2 border-primary"
                          )}
                          onClick={() => handleIniciarConversa(atendente)}
                        >
                          <ConnectAvatar
                            name={atendente.nome}
                            image={atendente.avatar || undefined}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-xs truncate">
                                {atendente.nome}
                              </span>
                              {cargoLabel && (
                                <Badge variant="secondary" className="h-4 px-1 text-[9px] font-normal">
                                  {cargoLabel}
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {setorNome || "Sem setor atribuído"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {contatosOrdenados.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        Nenhum contato encontrado
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Área de mensagens */}
        {conversaSelecionada && (
          <div className="flex-1 flex flex-col">
            {/* Header da conversa no modo gestão */}
            {modoGestao && (
              <div className="flex items-center gap-2 p-3 border-b bg-muted/20">
                <ConnectAvatar
                  name={conversaSelecionada.participanteNome}
                  image={conversaSelecionada.participanteAvatar}
                  size="sm"
                />
                <div>
                  <p className="font-medium text-sm">{conversaSelecionada.participanteNome}</p>
                  <p className="text-xs text-muted-foreground">
                    {conversaSelecionada.participanteSetor}
                    {conversaSelecionada.online && (
                      <span className="text-green-600 ml-2">● Online</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-3 [&_[data-radix-scroll-area-scrollbar]]:w-1.5 [&_[data-radix-scroll-area-thumb]]:bg-primary/30 hover:[&_[data-radix-scroll-area-thumb]]:bg-primary/50" ref={scrollRef}>
              <div className="space-y-3">
                {mensagens.map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.de === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] px-3 py-2 rounded-xl text-xs",
                        msg.de === "me"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                      )}
                    >
                      <p>{msg.texto}</p>
                      <span className={cn(
                        "text-[9px] block mt-1",
                        msg.de === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatarHora(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input de mensagem */}
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEnviarMensagem()}
                  className="h-9 text-xs"
                />
                <Button
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                  onClick={handleEnviarMensagem}
                  disabled={!novaMensagem.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder quando não tem conversa selecionada no modo gestão */}
        {modoGestao && !conversaSelecionada && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecione uma conversa</p>
              <p className="text-xs">para visualizar as mensagens</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
