import { useState, useEffect } from "react";
import { X, Copy, Heart, MessageCircle, TrendingUp, Clock, CalendarDays, Send, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { ThaliAvatar, type ThaliExpression } from "./ThaliAvatar";
import { format, subDays, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface ThaliPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Sugestao {
  texto: string;
  tipo: "empatica" | "objetiva" | "pergunta";
}

interface AnaliseContexto {
  sentimento: "muito_positivo" | "positivo" | "neutro" | "negativo" | "muito_negativo";
  sugestoes: Sugestao[];
  resumo: string;
  proximosPassos: string[];
}

const sentimentoConfig = {
  muito_positivo: { label: "Muito Positivo", color: "bg-green-500", icon: "😊" },
  positivo: { label: "Positivo", color: "bg-green-400", icon: "🙂" },
  neutro: { label: "Neutro", color: "bg-gray-400", icon: "😐" },
  negativo: { label: "Negativo", color: "bg-orange-400", icon: "😟" },
  muito_negativo: { label: "Muito Negativo", color: "bg-red-500", icon: "😢" },
};

export const ThaliPanel = ({ open, onClose }: ThaliPanelProps) => {
  const { pacienteSelecionado } = usePacienteContext();
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState<AnaliseContexto | null>(null);
  const [resumoDataInicio, setResumoDataInicio] = useState<Date | undefined>(undefined);
  const [resumoDataFim, setResumoDataFim] = useState<Date | undefined>(undefined);
  const [resumoCalendarioOpen, setResumoCalendarioOpen] = useState(false);
  const [resumoCarregando, setResumoCarregando] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [respostaDuvida, setRespostaDuvida] = useState<string | null>(null);
  const [duvidaCarregando, setDuvidaCarregando] = useState(false);
  
  // Data máxima permitida: 30 dias atrás
  const dataMinima = subDays(new Date(), 30);
  
  // Determinar expressão baseada no sentimento
  const getExpression = (): ThaliExpression => {
    if (loading) return "pensativa";
    if (!analise) return "neutral";
    
    switch (analise.sentimento) {
      case "muito_negativo":
      case "negativo":
        return "alertando";
      case "muito_positivo":
      case "positivo":
        return "feliz";
      default:
        return "neutral";
    }
  };

  useEffect(() => {
    if (open && pacienteSelecionado) {
      analisarContexto();
    }
  }, [open, pacienteSelecionado]);

  const analisarContexto = async () => {
    if (!pacienteSelecionado) return;

    setLoading(true);
    try {
      // Buscar mensagens da conversa
      const { data: conversa } = await supabase
        .from("conversas")
        .select("id, mensagens(*)")
        .eq("paciente_id", pacienteSelecionado.id)
        .single();

      const mensagens = conversa?.mensagens || [];
      const textoConversa = mensagens
        .map((m: any) => `${m.autor}: ${m.texto}`)
        .join("\n");

      // Chamar edge function da IA Thalí
      const { data, error } = await supabase.functions.invoke("ia-thali-analisar", {
        body: {
          paciente: pacienteSelecionado,
          conversaTexto: textoConversa,
        },
      });

      if (error) throw error;

      setAnalise(data);
    } catch (error) {
      console.error("Erro ao analisar contexto:", error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível analisar o contexto da conversa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySugestao = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast({
      title: "Sugestão copiada",
      description: "A sugestão foi copiada para a área de transferência",
    });
  };

  const handleComandoRapido = async (comando: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ia-thali-comando", {
        body: {
          comando,
          paciente: pacienteSelecionado,
        },
      });

      if (error) throw error;

      navigator.clipboard.writeText(data.resposta);
      toast({
        title: "Comando executado",
        description: "A resposta foi copiada para a área de transferência",
      });
    } catch (error) {
      console.error("Erro ao executar comando:", error);
      toast({
        title: "Erro no comando",
        description: "Não foi possível executar o comando",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const config = analise ? sentimentoConfig[analise.sentimento] : sentimentoConfig.neutro;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl animate-in slide-in-from-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4 bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <ThaliAvatar size="md" expression={getExpression()} />
              <div>
                <h2 className="text-lg font-semibold">Thalí</h2>
                <p className="text-xs text-muted-foreground">Assistente Inteligente</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {/* Análise de Sentimento */}
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Análise de Sentimento do Dia</h3>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ThaliAvatar size="sm" expression="pensativa" processing={true} />
                    <span>Analisando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center text-2xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">Baseado no atendimento de hoje</p>
                    </div>
                  </div>
                )}
              </Card>

              {/* Sugestões de Resposta */}
              {analise && analise.sugestoes.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm">Sugestões de Resposta</h3>
                  </div>
                  <div className="space-y-2">
                    {analise.sugestoes.map((sugestao, index) => (
                      <Card key={index} className="p-3 hover:bg-accent/50 transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Badge variant="outline" className="mb-2 text-xs">
                              {sugestao.tipo === "empatica" && "Empática"}
                              {sugestao.tipo === "objetiva" && "Objetiva"}
                              {sugestao.tipo === "pergunta" && "Pergunta"}
                            </Badge>
                            <p className="text-sm leading-relaxed">{sugestao.texto}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopySugestao(sugestao.texto)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo da Conversa */}
              {analise && analise.resumo && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm">Resumo da Conversa</h3>
                    </div>
                    <Card className="p-3 bg-muted/50">
                      <p className="text-sm leading-relaxed">{analise.resumo}</p>
                    </Card>
                  </div>
                </>
              )}

              {/* Próximos Passos */}
              {analise && analise.proximosPassos.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold text-sm">Próximos Passos Sugeridos</h3>
                    </div>
                    <div className="space-y-2">
                      {analise.proximosPassos.map((passo, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-relaxed">{passo}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Comandos Rápidos */}
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3">Comandos Rápidos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {/* Botão Resumir com Popover de Período */}
                  <Popover open={resumoCalendarioOpen} onOpenChange={setResumoCalendarioOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loading || resumoCarregando}
                        className="w-full"
                      >
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                        Resumir conversa
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Selecione o período</h4>
                          <p className="text-xs text-muted-foreground">Máximo: últimos 30 dias</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs">Data inicial</Label>
                            <Calendar
                              mode="single"
                              selected={resumoDataInicio}
                              onSelect={setResumoDataInicio}
                              disabled={(date) => 
                                isBefore(date, startOfDay(dataMinima)) || 
                                isAfter(date, endOfDay(new Date()))
                              }
                              className={cn("rounded-md border pointer-events-auto")}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Data final</Label>
                            <Calendar
                              mode="single"
                              selected={resumoDataFim}
                              onSelect={setResumoDataFim}
                              disabled={(date) => 
                                isBefore(date, startOfDay(dataMinima)) || 
                                isAfter(date, endOfDay(new Date())) ||
                                (resumoDataInicio ? isBefore(date, startOfDay(resumoDataInicio)) : false)
                              }
                              className={cn("rounded-md border pointer-events-auto")}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setResumoDataInicio(undefined);
                              setResumoDataFim(undefined);
                            }}
                          >
                            Limpar
                          </Button>
                          <Button 
                            size="sm"
                            disabled={!resumoDataInicio || !resumoDataFim || resumoCarregando}
                            onClick={async () => {
                              setResumoCalendarioOpen(false);
                              setResumoCarregando(true);
                              try {
                                const { data, error } = await supabase.functions.invoke("ia-thali-comando", {
                                  body: {
                                    comando: "resumir",
                                    paciente: pacienteSelecionado,
                                    dataInicio: resumoDataInicio?.toISOString(),
                                    dataFim: resumoDataFim?.toISOString(),
                                  },
                                });

                                if (error) throw error;

                                navigator.clipboard.writeText(data.resposta);
                                toast({
                                  title: "Resumo gerado",
                                  description: `Resumo do período ${format(resumoDataInicio!, "dd/MM")} - ${format(resumoDataFim!, "dd/MM")} copiado`,
                                });
                              } catch (error) {
                                console.error("Erro ao resumir:", error);
                                toast({
                                  title: "Erro ao resumir",
                                  description: "Não foi possível gerar o resumo",
                                  variant: "destructive",
                                });
                              } finally {
                                setResumoCarregando(false);
                              }
                            }}
                          >
                            {resumoCarregando ? "Gerando..." : "Gerar resumo"}
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComandoRapido("empatica")}
                    disabled={loading}
                  >
                    Resposta empática
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComandoRapido("objetiva")}
                    disabled={loading}
                  >
                    Resposta objetiva
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleComandoRapido("ligacao")}
                    disabled={loading}
                  >
                    Sugerir ligação
                  </Button>
                </div>
              </div>

              {/* Campo para tirar dúvidas */}
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Tire suas dúvidas</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Pergunte à Thalí com base na base de conhecimento configurada
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Qual o valor do procedimento X?"
                    value={pergunta}
                    onChange={(e) => setPergunta(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && pergunta.trim()) {
                        e.preventDefault();
                        handlePerguntarDuvida();
                      }
                    }}
                    disabled={duvidaCarregando}
                  />
                  <Button 
                    size="icon"
                    onClick={handlePerguntarDuvida}
                    disabled={!pergunta.trim() || duvidaCarregando}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {duvidaCarregando && (
                  <Card className="mt-3 p-3 bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ThaliAvatar size="sm" expression="pensativa" processing={true} />
                      <span>Consultando base de conhecimento...</span>
                    </div>
                  </Card>
                )}
                
                {respostaDuvida && !duvidaCarregando && (
                  <Card className="mt-3 p-3 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-2">
                      <ThaliAvatar size="sm" expression="feliz" />
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{respostaDuvida}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={() => {
                            navigator.clipboard.writeText(respostaDuvida);
                            toast({
                              title: "Resposta copiada",
                              description: "A resposta foi copiada para a área de transferência",
                            });
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copiar resposta
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );

  async function handlePerguntarDuvida() {
    if (!pergunta.trim()) return;
    
    setDuvidaCarregando(true);
    setRespostaDuvida(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("ia-thali-comando", {
        body: {
          comando: "duvida",
          pergunta: pergunta,
          paciente: pacienteSelecionado,
        },
      });

      if (error) throw error;

      setRespostaDuvida(data.resposta);
      setPergunta("");
    } catch (error) {
      console.error("Erro ao consultar:", error);
      toast({
        title: "Erro na consulta",
        description: "Não foi possível obter resposta da Thalí",
        variant: "destructive",
      });
    } finally {
      setDuvidaCarregando(false);
    }
  }
};
