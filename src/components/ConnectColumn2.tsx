import { Send, Paperclip, Mic, UserCog, Phone, MoreVertical, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
import { ConnectStatusIndicator } from "./ConnectStatusIndicator";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useConversaByPaciente, useMensagensByConversa } from "@/hooks/useConversas";
import { ConnectMessageBubblePatient, ConnectMessageBubbleAttendant } from "./ConnectMessageBubble";
import { useEnviarMensagem, useAtualizarStatusPaciente } from "@/hooks/useMutations";
import { useState, useEffect, useRef } from "react";
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

export const ConnectColumn2 = () => {
  const { pacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const { data: conversa } = useConversaByPaciente(pacienteSelecionado?.id || null);
  const { data: mensagens } = useMensagensByConversa(conversa?.id || null);
  const enviarMensagem = useEnviarMensagem();
  const atualizarStatus = useAtualizarStatusPaciente();
  const iniciarChamada = useIniciarChamada();
  const { setChamadaAtiva } = useChamadaContext();
  const [mensagemTexto, setMensagemTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAnexo = useUploadAnexo();

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

    // Se for a primeira mensagem do atendente e o paciente está na fila, mudar status
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
    
    // Focar no input após inserir emoji
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }, 0);
  };

  const handleStickerSelect = async (stickerUrl: string, stickerName: string) => {
    if (!conversa?.id || !pacienteSelecionado) return;

    // Se for a primeira mensagem do atendente e o paciente está na fila, mudar status
    const ehPrimeiraMensagemAtendente = !mensagens?.some(m => m.autor === "atendente");
    if (ehPrimeiraMensagemAtendente && pacienteSelecionado.status === "fila" && atendenteLogado) {
      await atualizarStatus.mutateAsync({
        pacienteId: pacienteSelecionado.id,
        novoStatus: "em_atendimento",
        atendenteId: atendenteLogado.id,
      });
    }

    // Buscar o ID da figurinha pela URL
    const { data: figurinha } = await supabase
      .from('figurinhas')
      .select('id')
      .eq('url_imagem', stickerUrl)
      .single();

    if (!figurinha) {
      toast.error("Erro ao enviar figurinha");
      return;
    }

    // Enviar como mensagem de figurinha
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
      // Criar mensagem vazia para anexar o arquivo
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

      // Upload do arquivo
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
      // Criar arquivo do blob
      const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, {
        type: 'audio/webm;codecs=opus'
      });

      // Criar mensagem vazia para anexar o áudio
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

      // Upload do áudio
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

  const getStatusBadge = () => {
    if (!pacienteSelecionado) return "offline";
    
    switch (pacienteSelecionado.status) {
      case "fila":
        return "espera";
      case "em_atendimento":
        return "andamento";
      case "finalizado":
        return "finalizado";
      default:
        return "offline";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      {/* Header com Avatar e Status */}
      <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
        <div className="flex items-center gap-3">
          <ConnectAvatar 
            name={pacienteSelecionado?.nome || "Selecione um paciente"} 
            image={pacienteSelecionado?.avatar || undefined}
          />
          <div className="flex items-center gap-2">
            <ConnectStatusIndicator 
              status={getStatusBadge()} 
              tempoNaFila={pacienteSelecionado?.tempo_na_fila || 0}
            />
            <div>
              <h3 className="font-medium text-sm text-foreground">
                {pacienteSelecionado?.nome || "Selecione um paciente"}
              </h3>
              {mensagens && mensagens.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {new Date(mensagens[mensagens.length - 1].created_at).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPerfilOpen(true)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

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
              const msg = mensagem as any; // Cast necessário pois tipos são auto-gerados
              return msg.autor === "paciente" ? (
                <ConnectMessageBubblePatient
                  key={msg.id}
                  content={msg.texto}
                  time={msg.horario}
                  senderName={pacienteSelecionado.nome}
                  mensagemId={msg.id}
                  tipoConteudo={msg.tipo_conteudo || 'texto'}
                  figurinhaId={msg.figurinha_id}
                />
              ) : (
                <ConnectMessageBubbleAttendant
                  key={msg.id}
                  content={msg.texto}
                  time={msg.horario}
                  mensagemId={msg.id}
                  tipoConteudo={msg.tipo_conteudo || 'texto'}
                  figurinhaId={msg.figurinha_id}
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
      <div className="border-t border-border bg-card p-4">
        {isRecordingAudio ? (
          <AudioRecorder
            onAudioRecorded={handleAudioRecorded}
            disabled={!pacienteSelecionado}
          />
        ) : (
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
              placeholder="Digite sua mensagem..."
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

      {/* Perfil do Paciente */}
      <PerfilPacienteSheet
        open={perfilOpen}
        onOpenChange={setPerfilOpen}
        paciente={pacienteSelecionado}
      />
    </div>
  );
};
