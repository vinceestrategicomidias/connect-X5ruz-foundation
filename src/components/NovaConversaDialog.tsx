import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquarePlus, UserPlus, Phone } from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { useCriarPaciente } from "@/hooks/useMutations";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface NovaConversaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NovaConversaDialog = ({ open, onOpenChange }: NovaConversaDialogProps) => {
  const [busca, setBusca] = useState("");
  const [showNovoContato, setShowNovoContato] = useState(false);
  const [novoContato, setNovoContato] = useState({
    nome: "",
    telefone: "",
    email: "",
    observacao: "",
  });

  const { data: todosPacientes } = useTodosPacientes();
  const criarPaciente = useCriarPaciente();
  const { setPacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();

  // Filtrar pacientes pela busca
  const pacientesFiltrados = todosPacientes?.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.telefone.includes(busca)
  ) || [];

  // Verificar se a busca é um número de telefone
  const ehNumeroTelefone = /^\+?\d+$/.test(busca.replace(/[\s()-]/g, ''));
  const numeroJaExiste = pacientesFiltrados.some(p => 
    p.telefone.replace(/[\s()-]/g, '') === busca.replace(/[\s()-]/g, '')
  );

  const handleSelecionarContato = (paciente: any) => {
    setPacienteSelecionado(paciente);
    onOpenChange(false);
    setBusca("");
    toast.success(`Conversa iniciada com ${paciente.nome}`);
  };

  const handleIniciarPorNumero = () => {
    if (!busca.trim()) {
      toast.error("Digite um número de telefone");
      return;
    }

    const pacienteExistente = pacientesFiltrados[0];
    if (pacienteExistente) {
      handleSelecionarContato(pacienteExistente);
    } else {
      // Preencher formulário de novo contato com o número
      setNovoContato({ ...novoContato, telefone: busca });
      setShowNovoContato(true);
    }
  };

  const handleCriarNovoContato = async () => {
    if (!novoContato.nome.trim() || novoContato.nome.length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (!novoContato.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    try {
      const novoPaciente: any = await criarPaciente.mutateAsync({
        nome: novoContato.nome,
        telefone: novoContato.telefone,
        status: "fila",
        setor_id: atendenteLogado?.setor_id,
      });

      setPacienteSelecionado(novoPaciente);
      onOpenChange(false);
      setShowNovoContato(false);
      setNovoContato({ nome: "", telefone: "", email: "", observacao: "" });
      setBusca("");
      toast.success(`Contato ${novoContato.nome} criado com sucesso!`);
    } catch (error) {
      toast.error("Erro ao criar contato");
    }
  };

  const handleVoltar = () => {
    setShowNovoContato(false);
    setNovoContato({ nome: "", telefone: "", email: "", observacao: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            {showNovoContato ? "Criar novo contato" : "Nova conversa"}
          </DialogTitle>
        </DialogHeader>

        {!showNovoContato ? (
          <div className="space-y-4">
            {/* Barra de busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou número"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>

            <Tabs defaultValue="contatos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="contatos">Contatos salvos</TabsTrigger>
                <TabsTrigger value="numero">Por número</TabsTrigger>
              </TabsList>

              <TabsContent value="contatos" className="space-y-3">
                <ScrollArea className="h-[300px] pr-4">
                  {pacientesFiltrados.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum contato encontrado</p>
                      {busca && (
                        <Button
                          variant="link"
                          onClick={() => setShowNovoContato(true)}
                          className="mt-2"
                        >
                          Criar novo contato
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pacientesFiltrados.map((paciente) => (
                        <button
                          key={paciente.id}
                          onClick={() => handleSelecionarContato(paciente)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <ConnectAvatar name={paciente.nome} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{paciente.nome}</p>
                            <p className="text-sm text-muted-foreground">{paciente.telefone}</p>
                          </div>
                          {paciente.status === "em_atendimento" && (
                            <Badge variant="secondary" className="text-xs">
                              Em atendimento
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="numero" className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Número de telefone</Label>
                    <Input
                      placeholder="+55 (11) 91234-5678"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                    />
                  </div>

                  {ehNumeroTelefone && busca.length >= 8 && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      {numeroJaExiste ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Este número já está cadastrado:
                          </p>
                          <div className="flex items-center gap-2">
                            <ConnectAvatar name={pacientesFiltrados[0]?.nome} size="sm" />
                            <div>
                              <p className="font-medium">{pacientesFiltrados[0]?.nome}</p>
                              <p className="text-sm text-muted-foreground">{pacientesFiltrados[0]?.telefone}</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleSelecionarContato(pacientesFiltrados[0])}
                            className="w-full mt-2"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Iniciar conversa
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Este número não está cadastrado.
                          </p>
                          <Button
                            onClick={handleIniciarPorNumero}
                            className="w-full"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Criar contato e iniciar conversa
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              variant="outline"
              onClick={() => setShowNovoContato(true)}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Criar novo contato
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input
                placeholder="Nome do contato"
                value={novoContato.nome}
                onChange={(e) => setNovoContato({ ...novoContato, nome: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input
                placeholder="+55 (11) 91234-5678"
                value={novoContato.telefone}
                onChange={(e) => setNovoContato({ ...novoContato, telefone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail (opcional)</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={novoContato.email}
                onChange={(e) => setNovoContato({ ...novoContato, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Input
                placeholder="Informações adicionais"
                value={novoContato.observacao}
                onChange={(e) => setNovoContato({ ...novoContato, observacao: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleVoltar}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleCriarNovoContato}
                disabled={criarPaciente.isPending}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Criar e iniciar conversa
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
