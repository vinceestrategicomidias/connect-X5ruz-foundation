import { Send, Paperclip, Mic, UserCog, Phone, MoreVertical, Smile, Pencil, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
// ConnectStatusIndicator removed from header per user request
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useConversaByPaciente, useMensagensByConversa } from "@/hooks/useConversas";
import { ConnectMessageBubblePatient, ConnectMessageBubbleAttendant } from "./ConnectMessageBubble";
import { useEnviarMensagem, useAtualizarStatusPaciente, useAtualizarContatoPaciente } from "@/hooks/useMutations";
import { useState, useEffect, useRef, useCallback } from "react";
import { ConnectTransferDialogNew } from "./ConnectTransferDialogNew";
import { supabase } from "@/integrations/supabase/client";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useIniciarChamada } from "@/hooks/useChamadas";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { toast } from "sonner";
import { PerfilPacienteSheet } from "./PerfilPacienteSheet";
import { AttachmentMenu } from "./AttachmentMenu";
import { AudioRecorder } from "./AudioRecorder";
import { useUploadAnexo } from "@/hooks/useAnexos";
import { EmojiStickerPicker } from "./EmojiStickerPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EditarContatoDialog } from "./EditarContatoDialog";
import { FinalizarConversaDialog } from "./FinalizarConversaDialog";
import { BuscaConversaBar } from "./BuscaConversaBar";
import { MensagemAcoesBar } from "./MensagemAcoesBar";
import { EncaminharMensagemDialog } from "./EncaminharMensagemDialog";
import { adicionarMensagemFavoritada } from "@/hooks/useMensagensFavoritadas";
import { useFinalizarAtendimento } from "@/hooks/useFinalizarAtendimento";
import { MensagensRapidasDropdown } from "./MensagensRapidasDropdown";
import { FunilIndicador } from "./FunilIndicador";
import { useLeadAtivoPaciente } from "@/hooks/useLeadsFunil";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ConnectColumn2 = () => {
  const { pacienteSelecionado, setPacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const { data: conversa } = useConversaByPaciente(pacienteSelecionado?.id || null);
  const { data: mensagens } = useMensagensByConversa(conversa?.id || null);
  const enviarMensagem = useEnviarMensagem();
  const atualizarStatus = useAtualizarStatusPaciente();
  const finalizarAtendimento = useFinalizarAtendimento();
  const iniciarChamada = useIniciarChamada();
  const { setChamadaAtiva } = useChamadaContext();
  const [mensagemTexto, setMensagemTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [editarNomeOpen, setEditarNomeOpen] = useState(false);
  const [finalizarDialogOpen, setFinalizarDialogOpen] = useState(false);
  const [buscaOpen, setBuscaOpen] = useState(false);
  const [mensagemDestacadaId, setMensagemDestacadaId] = useState<string | null>(null);
  const [mensagemSelecionada, setMensagemSelecionada] = useState<any>(null);
  const [encaminharDialogOpen, setEncaminharDialogOpen] = useState(false);
  const [reacoes, setReacoes] = useState<Record<string, string>>({});
  const [favoritas, setFavoritas] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAnexo = useUploadAnexo();
  const atualizarContato = useAtualizarContatoPaciente();
  const { data: leadAtivo } = useLeadAtivoPaciente(pacienteSelecionado?.id || null);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Realtime para mensagens
  useEffect(() => {
    if (!conversa?.id) return;

    const channel = supabase
      .channel(`mensagens-${conversa.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mensagens",
          filter: `conversa_id=eq.${conversa.id}`,
        },
        () => {
          // Forçar atualização
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversa?.id]);

  const handleEnviarMensagem = async () => {
    if (!mensagemTexto.trim() || !conversa?.id || !pacienteSelecionado) return;

    const ehPrimeiraMensagemAtendente = !mensagens?.some(m => m.autor === "atendente");
    if (ehPrimeiraMensagemAtendente && pacienteSelecionado.status === "fila" && atendenteLogado) {
      await atualizarStatus.mutateAsync({
        pacienteId: pacienteSelecionado.id,
        novoStatus: "em_atendimento",
        atendenteId: atendenteLogado.id,
      });
    }

    await enviarMensagem.mutateAsync({
      conversaId: conversa.id,
      texto: mensagemTexto,
      autor: "atendente",
    });

    setMensagemTexto("");
    setDigitando(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    const cursorPos = inputRef.current?.selectionStart || mensagemTexto.length;
    const newText = 
      mensagemTexto.slice(0, cursorPos) + 
      emoji + 
      mensagemTexto.slice(cursorPos);
    setMensagemTexto(newText);
    setEmojiPickerOpen(false);
    
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }, 0);
  };

  const handleStickerSelect = async (stickerUrl: string, stickerName: string) => {
    if (!conversa?.id || !pacienteSelecionado) return;

    const ehPrimeiraMensagemAtendente = !mensagens?.some(m => m.autor === "atendente");
    if (ehPrimeiraMensagemAtendente && pacienteSelecionado.status === "fila" && atendenteLogado) {
      await atualizarStatus.mutateAsync({
        pacienteId: pacienteSelecionado.id,
        novoStatus: "em_atendimento",
        atendenteId: atendenteLogado.id,
      });
    }

    const { data: figurinha } = await supabase
      .from('figurinhas')
      .select('id')
      .eq('url_imagem', stickerUrl)
      .single();

    if (!figurinha) {
      toast.error("Erro ao enviar figurinha");
      return;
    }

    const { error } = await supabase
      .from('mensagens')
      .insert({
        conversa_id: conversa.id,
        texto: stickerName,
        autor: "atendente",
        tipo: "imagem",
        tipo_conteudo: "figurinha",
        figurinha_id: figurinha.id,
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      });

    if (error) {
      toast.error("Erro ao enviar figurinha");
      console.error(error);
    }

    setEmojiPickerOpen(false);
  };

  const handleFileSelect = async (file: File, tipo: string) => {
    if (!conversa?.id || !pacienteSelecionado) {
      toast.error("Selecione um paciente primeiro");
      return;
    }

    try {
      const { data: mensagem, error } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversa.id,
          texto: '',
          autor: 'atendente',
          tipo: 'texto',
          horario: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        })
        .select()
        .single();

      if (error || !mensagem) {
        throw new Error(error?.message || 'Erro ao criar mensagem');
      }

      await uploadAnexo.mutateAsync({
        mensagemId: mensagem.id,
        file,
        tipo,
      });

    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Erro ao enviar arquivo');
    }
  };

  const handleAudioRecorded = async (audioBlob: Blob, duration: number) => {
    if (!conversa?.id || !pacienteSelecionado) {
      toast.error("Selecione um paciente primeiro");
      return;
    }

    try {
      const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, {
        type: 'audio/webm;codecs=opus'
      });

      const { data: mensagem, error } = await supabase
        .from('mensagens')
        .insert({
          conversa_id: conversa.id,
          texto: '',
          autor: 'atendente',
          tipo: 'texto',
          horario: new Date().toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
        })
        .select()
        .single();

      if (error || !mensagem) {
        throw new Error(error?.message || 'Erro ao criar mensagem');
      }

      await uploadAnexo.mutateAsync({
        mensagemId: mensagem.id,
        file: audioFile,
        tipo: 'audio',
      });

      setIsRecordingAudio(false);
    } catch (error) {
      console.error('Erro ao enviar áudio:', error);
      toast.error('Erro ao enviar áudio');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleLigar = async () => {
    if (!pacienteSelecionado || !atendenteLogado) return;

    const chamada = await iniciarChamada.mutateAsync({
      numeroDiscado: pacienteSelecionado.telefone,
      atendenteId: atendenteLogado.id,
      setorOrigem: atendenteLogado.setor_id,
      pacienteId: pacienteSelecionado.id,
      tipo: "paciente",
    });

    setChamadaAtiva(chamada);
    toast.success(`Ligando para ${pacienteSelecionado.nome}`);
  };


  const handleSalvarContato = async (novoNome: string, novoTelefone: string) => {
    if (!pacienteSelecionado) return;
    
    await atualizarContato.mutateAsync({
      pacienteId: pacienteSelecionado.id,
      novoNome,
      novoTelefone,
    });
  };

  const handleFinalizarConversa = async (dados: {
    motivo: string;
    submotivo?: string;
    observacao?: string;
  }) => {
    if (!pacienteSelecionado || !atendenteLogado) return;

    await finalizarAtendimento.mutateAsync({
      pacienteId: pacienteSelecionado.id,
      pacienteNome: pacienteSelecionado.nome,
      atendenteId: atendenteLogado.id,
      atendenteNome: atendenteLogado.nome,
      motivo: dados.motivo,
      submotivo: dados.submotivo,
      observacao: dados.observacao,
    });

    setPacienteSelecionado(null);
  };

  const handleBuscaResultado = useCallback((mensagemId: string, index: number) => {
    setMensagemDestacadaId(mensagemId);
    
    // Scroll até a mensagem
    const element = document.querySelector(`[data-message-id="${mensagemId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleMensagemClick = (mensagem: any) => {
    setMensagemSelecionada(mensagem);
  };

  const handleReagir = (emoji: string) => {
    if (mensagemSelecionada) {
      setReacoes(prev => ({
        ...prev,
        [mensagemSelecionada.id]: emoji,
      }));
    }
  };

  const handleFavoritar = (opcao: "historico" | "nota", nota?: string) => {
    if (mensagemSelecionada && pacienteSelecionado) {
      setFavoritas(prev => new Set(prev).add(mensagemSelecionada.id));
      
      adicionarMensagemFavoritada(
        pacienteSelecionado.id,
        pacienteSelecionado.nome,
        {
          id: mensagemSelecionada.id,
          texto: mensagemSelecionada.texto,
          autor: mensagemSelecionada.autor,
          horario: mensagemSelecionada.horario,
        },
        opcao,
        nota,
        atendenteLogado?.nome || "Você"
      );
      
      if (opcao === "historico") {
        toast.success("Mensagem adicionada ao histórico");
      } else if (opcao === "nota" && nota) {
        toast.success("Nota adicionada ao paciente");
      }
    }
  };

  const handleEncaminharMensagem = (contatosIds: string[]) => {
    console.log("Encaminhando mensagem para:", contatosIds);
    setEncaminharDialogOpen(false);
    setMensagemSelecionada(null);
  };


  return (
    <div className="flex-1 flex flex-col bg-muted/20 relative">
      {/* Header com Avatar e Status */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
        <div className="flex items-center gap-3">
          {/* Avatar clicável para abrir perfil */}
          <button 
            onClick={() => pacienteSelecionado && setPerfilOpen(true)}
            className="relative group cursor-pointer"
            title={pacienteSelecionado ? "Ver perfil do paciente" : undefined}
          >
            <ConnectAvatar 
              name={pacienteSelecionado?.nome || "Selecione um paciente"} 
              image={pacienteSelecionado?.avatar || undefined}
            />
            {pacienteSelecionado && (
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {pacienteSelecionado?.nome || "Selecione um paciente"}
                </h3>
              </div>
              {pacienteSelecionado && <FunilIndicador pacienteId={pacienteSelecionado.id} />}
              {pacienteSelecionado && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setEditarNomeOpen(true)}
                    title="Editar nome do contato"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setBuscaOpen(true)}
                    title="Pesquisar na conversa"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {pacienteSelecionado && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleLigar}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTransferDialog(true)}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Transferir
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPerfilOpen(true)}>
                  Ver Perfil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFinalizarDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Finalizar conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Barra de busca */}
      <BuscaConversaBar
        open={buscaOpen}
        onClose={() => {
          setBuscaOpen(false);
          setMensagemDestacadaId(null);
        }}
        mensagens={mensagens?.map(m => ({
          id: m.id,
          texto: m.texto,
          autor: m.autor,
          horario: m.horario,
        })) || []}
        onResultadoClick={handleBuscaResultado}
      />

      {/* Barra de ações de mensagem */}
      {mensagemSelecionada && (
        <MensagemAcoesBar
          mensagem={mensagemSelecionada}
          onClose={() => setMensagemSelecionada(null)}
          onOpenEncaminharDialog={() => setEncaminharDialogOpen(true)}
          onReagir={handleReagir}
          onFavoritar={handleFavoritar}
        />
      )}

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        {!pacienteSelecionado ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Selecione um paciente para iniciar o atendimento
            </p>
          </div>
        ) : !mensagens || mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">
              Nenhuma mensagem ainda
            </p>
          </div>
        ) : (
          <div>
            {mensagens.map((mensagem) => {
              const msg = mensagem as any;
              const destacada = mensagemDestacadaId === msg.id;
              const reacao = reacoes[msg.id];
              const favoritada = favoritas.has(msg.id);
              
              return msg.autor === "paciente" ? (
                <ConnectMessageBubblePatient
                  key={msg.id}
                  content={msg.texto}
                  time={msg.horario}
                  senderName={pacienteSelecionado.nome}
                  mensagemId={msg.id}
                  tipoConteudo={msg.tipo_conteudo || 'texto'}
                  figurinhaId={msg.figurinha_id}
                  destacada={destacada}
                  reacao={reacao}
                  favoritada={favoritada}
                  onClick={() => handleMensagemClick(msg)}
                />
              ) : (
                <ConnectMessageBubbleAttendant
                  key={msg.id}
                  content={msg.texto}
                  time={msg.horario}
                  senderName={atendenteLogado?.nome?.split(' ')[0]?.toUpperCase()}
                  mensagemId={msg.id}
                  tipoConteudo={msg.tipo_conteudo || 'texto'}
                  figurinhaId={msg.figurinha_id}
                  destacada={destacada}
                  reacao={reacao}
                  favoritada={favoritada}
                  onClick={() => handleMensagemClick(msg)}
                />
              );
            })}
            {digitando && (
              <div className="text-xs text-muted-foreground italic ml-2 mt-2">
                Digitando...
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input de Mensagem */}
      <div className="border-t border-border bg-card p-4 relative">
        {isRecordingAudio ? (
          <AudioRecorder
            onAudioRecorded={handleAudioRecorded}
            disabled={!pacienteSelecionado}
          />
        ) : (
          <>
            <MensagensRapidasDropdown
              searchText={mensagemTexto}
              onSelect={(texto) => {
                setMensagemTexto(texto);
                setDigitando(true);
                inputRef.current?.focus();
              }}
              visible={mensagemTexto.startsWith("/") && mensagemTexto.length >= 1}
            />
            <div className="flex items-center gap-2">
              <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={!pacienteSelecionado}
                    title="Emojis e figurinhas"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="top" 
                  align="start" 
                  className="p-0 w-auto border-0"
                  sideOffset={8}
                >
                  <EmojiStickerPicker
                    onEmojiSelect={handleEmojiSelect}
                    onStickerSelect={handleStickerSelect}
                  />
                </PopoverContent>
              </Popover>
              
              <AttachmentMenu
                onFileSelect={handleFileSelect}
                disabled={!pacienteSelecionado}
              >
                <Button variant="outline" size="icon" disabled={!pacienteSelecionado}>
                  <Paperclip className="h-4 w-4" />
                </Button>
              </AttachmentMenu>
              
              <Input
                ref={inputRef}
                placeholder="Digite '/' para mensagens rápidas..."
                className="flex-1"
                disabled={!pacienteSelecionado}
                value={mensagemTexto}
                onChange={(e) => {
                  setMensagemTexto(e.target.value);
                  setDigitando(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
              />
              
              <Button
                variant="outline"
                size="icon"
                disabled={!pacienteSelecionado}
                onClick={() => setIsRecordingAudio(true)}
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              <Button
                size="icon"
                disabled={!pacienteSelecionado || !mensagemTexto.trim()}
                onClick={handleEnviarMensagem}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Dialog de Transferência */}
      {pacienteSelecionado && conversa && (
        <ConnectTransferDialogNew
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          pacienteId={pacienteSelecionado.id}
          conversaId={conversa.id}
          pacienteNome={pacienteSelecionado.nome}
        />
      )}

      {/* Sheet de Perfil */}
      <PerfilPacienteSheet
        open={perfilOpen}
        onOpenChange={setPerfilOpen}
        paciente={pacienteSelecionado}
      />

      {/* Dialog de Editar Contato */}
      <EditarContatoDialog
        open={editarNomeOpen}
        onOpenChange={setEditarNomeOpen}
        nomeAtual={pacienteSelecionado?.nome || ""}
        telefoneAtual={pacienteSelecionado?.telefone || ""}
        onSalvar={handleSalvarContato}
      />

      {/* Dialog de Finalizar Conversa */}
      {pacienteSelecionado && (
        <FinalizarConversaDialog
          open={finalizarDialogOpen}
          onOpenChange={setFinalizarDialogOpen}
          pacienteNome={pacienteSelecionado.nome}
          onConfirmar={handleFinalizarConversa}
        />
      )}

      {/* Dialog de Encaminhar Mensagem */}
      {mensagemSelecionada && (
        <EncaminharMensagemDialog
          open={encaminharDialogOpen}
          onOpenChange={setEncaminharDialogOpen}
          mensagem={mensagemSelecionada}
          onEncaminhar={handleEncaminharMensagem}
        />
      )}

    </div>
  );
};
