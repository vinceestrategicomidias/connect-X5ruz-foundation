import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Users,
  Shield,
  Phone,
  Bot,
  MessageSquare,
  Bell,
  Code,
  Save,
  Plus,
  Trash2,
  Edit,
  Settings,
  MessagesSquare,
} from "lucide-react";
import { ChatInternoPanel } from "./ChatInternoEquipe";
import { useEmpresas, useAtualizarEmpresa } from "@/hooks/useEmpresas";
import { useUnidades, useCriarUnidade, useAtualizarUnidade } from "@/hooks/useUnidades";
import { useSetores } from "@/hooks/useSetores";
import { usePerfisAcesso, useCriarPerfil, useAtualizarPerfil } from "@/hooks/usePerfisAcesso";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useMensageriaConfig, useAtualizarMensageriaConfig } from "@/hooks/useMensageriaConfig";
import { useUraConfig, useAtualizarUraConfig } from "@/hooks/useUraConfig";
import { toast } from "sonner";

interface ConfiguracoesManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConfiguracoesManagement({ open, onOpenChange }: ConfiguracoesManagementProps) {
  const [activeTab, setActiveTab] = useState("empresa");

  // Hooks
  const { data: empresas } = useEmpresas();
  const { mutate: atualizarEmpresa } = useAtualizarEmpresa();
  const { data: unidades } = useUnidades();
  const { mutate: criarUnidade } = useCriarUnidade();
  const { mutate: atualizarUnidade } = useAtualizarUnidade();
  const { data: setores } = useSetores();
  const { data: perfis } = usePerfisAcesso();
  const { mutate: criarPerfil } = useCriarPerfil();
  const { mutate: atualizarPerfil } = useAtualizarPerfil();
  const { data: atendentes } = useAtendentes();
  const { data: mensageriaConfigs } = useMensageriaConfig();
  const { mutate: atualizarMensageria } = useAtualizarMensageriaConfig();
  const { data: uraConfigs } = useUraConfig();
  const { mutate: atualizarUra } = useAtualizarUraConfig();

  // Estados para formulários
  const [empresaForm, setEmpresaForm] = useState({
    nome: "Grupo Liruz",
    cnpj: "28.443.771/0001-92",
    endereco: "Av. Nossa Senhora da Penha, 1500 - Praia do Canto, Vitória - ES",
    responsavel: "Administrador",
  });

  const [novaUnidade, setNovaUnidade] = useState({
    nome: "",
    codigo_interno: "",
    endereco: "",
    fuso_horario: "America/Sao_Paulo",
  });

  const [uraForm, setUraForm] = useState({
    ativo: true,
    mensagem_boas_vindas: "Bem-vindo ao Grupo Liruz. Para melhor atendê-lo, selecione uma opção.",
    mensagem_fora_expediente: "Nosso horário de atendimento é das 7h às 19h.",
    mensagem_lotacao: "No momento, todas as linhas estão ocupadas. Aguarde.",
    voz_tipo: "feminino",
    opcoes: [
      { tecla: "1", destino: "Pré-venda", mensagem: "Redirecionando você para o setor de Pré-Venda." },
      { tecla: "2", destino: "Convênios", mensagem: "Encaminhando para o setor de convênios." },
      { tecla: "3", destino: "Comercial Connect", mensagem: "Aguarde enquanto transferimos você para o Comercial Connect." },
    ],
  });

  const [iaForm, setIaForm] = useState({
    ia_ativa: true,
    robo_ativo: true,
    assistente_config: {
      pre_atendimento: true,
      sugestao_respostas: true,
      analise_sentimento: true,
      identificacao_urgencia: true,
    },
  });

  const [alertasConfig, setAlertasConfig] = useState({
    fila_alta: { ativo: true, limite: 12 },
    nps_baixo: { ativo: true, limite: 7 },
    tempo_resposta_alto: { ativo: true, limite: "6m" },
    previsao_pico: { ativo: true, limite: "80%" },
  });

  const [apiConfig, setApiConfig] = useState({
    chave_api: "LIRUZ-API-KEY-001",
    endpoints: [
      { nome: "Criar paciente", url: "/api/pacientes/create", ativo: true },
      { nome: "Enviar mensagem", url: "/api/chat/send", ativo: true },
      { nome: "Criar atendimento", url: "/api/atendimentos/start", ativo: true },
      { nome: "Listar setores", url: "/api/setores", ativo: true },
    ],
    webhooks: [
      { evento: "nova_mensagem", url: "https://webhook.exemplo.com/mensagens", ativo: true },
      { evento: "alteracao_status", url: "https://webhook.exemplo.com/status", ativo: true },
    ],
  });

  const handleSalvarEmpresa = () => {
    if (empresas && empresas.length > 0) {
      atualizarEmpresa({ id: empresas[0].id, dados: empresaForm });
    }
  };

  const handleCriarUnidade = () => {
    if (novaUnidade.nome && novaUnidade.codigo_interno) {
      criarUnidade(novaUnidade);
      setNovaUnidade({ nome: "", codigo_interno: "", endereco: "", fuso_horario: "America/Sao_Paulo" });
    } else {
      toast.error("Preencha nome e código da unidade");
    }
  };

  const handleSalvarUra = () => {
    if (uraConfigs && uraConfigs.length > 0) {
      atualizarUra({
        id: uraConfigs[0].id,
        dados: {
          ...uraForm,
          opcoes: uraForm.opcoes,
        },
      });
    }
  };

  const handleSalvarIA = () => {
    if (mensageriaConfigs && mensageriaConfigs.length > 0) {
      atualizarMensageria({
        id: mensageriaConfigs[0].id,
        dados: iaForm,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start px-6 py-3 border-b rounded-none bg-muted/50">
            <TabsTrigger value="empresa" className="gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="unidades" className="gap-2">
              <MapPin className="h-4 w-4" />
              Unidades
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="perfis" className="gap-2">
              <Shield className="h-4 w-4" />
              Perfis
            </TabsTrigger>
            <TabsTrigger value="ura" className="gap-2">
              <Phone className="h-4 w-4" />
              URA
            </TabsTrigger>
            <TabsTrigger value="ia" className="gap-2">
              <Bot className="h-4 w-4" />
              Thalí
            </TabsTrigger>
            <TabsTrigger value="alertas" className="gap-2">
              <Bell className="h-4 w-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="chat-interno" className="gap-2">
              <MessagesSquare className="h-4 w-4" />
              Chat Interno
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* EMPRESA */}
              <TabsContent value="empresa" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <CardDescription>Informações corporativas do Grupo Liruz</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Empresa</Label>
                        <Input
                          value={empresaForm.nome}
                          onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CNPJ</Label>
                        <Input
                          value={empresaForm.cnpj}
                          onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Endereço</Label>
                        <Input
                          value={empresaForm.endereco}
                          onChange={(e) => setEmpresaForm({ ...empresaForm, endereco: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Responsável</Label>
                        <Input
                          value={empresaForm.responsavel}
                          onChange={(e) => setEmpresaForm({ ...empresaForm, responsavel: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSalvarEmpresa} className="gap-2">
                        <Save className="h-4 w-4" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Informações Corporativas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Telefone Corporativo:</span>
                      <span className="text-sm font-medium">+55 11 4002-8922</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Email Corporativo:</span>
                      <span className="text-sm font-medium">contato@grupoliruz.com</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* UNIDADES */}
              <TabsContent value="unidades" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Nova Unidade</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome da Unidade</Label>
                        <Input
                          placeholder="Ex: Unidade São Paulo"
                          value={novaUnidade.nome}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, nome: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Código Interno</Label>
                        <Input
                          placeholder="Ex: SP01"
                          value={novaUnidade.codigo_interno}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, codigo_interno: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Endereço</Label>
                        <Input
                          placeholder="Endereço completo"
                          value={novaUnidade.endereco}
                          onChange={(e) => setNovaUnidade({ ...novaUnidade, endereco: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button onClick={handleCriarUnidade} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Criar Unidade
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Unidades Cadastradas ({unidades?.length || 0})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {unidades?.map((unidade) => (
                          <div key={unidade.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{unidade.nome}</h4>
                                <Badge variant="outline">{unidade.codigo_interno}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{unidade.endereco}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* USUÁRIOS */}
              <TabsContent value="usuarios" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Usuários do Sistema ({atendentes?.length || 0})</CardTitle>
                    <CardDescription>Gestão de atendentes, coordenadores e gestores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3">
                        {atendentes?.map((atendente) => (
                          <div key={atendente.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <img
                              src={atendente.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + atendente.nome}
                              alt={atendente.nome}
                              className="h-12 w-12 rounded-full"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{atendente.nome}</h4>
                                <Badge variant={atendente.cargo === "gestor" ? "default" : atendente.cargo === "coordenacao" ? "secondary" : "outline"}>
                                  {atendente.cargo}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Setor ID: {atendente.setor_id}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PERFIS */}
              <TabsContent value="perfis" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Perfis de Acesso</CardTitle>
                    <CardDescription>Gerenciar permissões por perfil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {perfis?.map((perfil) => (
                          <div key={perfil.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{perfil.nome}</h4>
                                <p className="text-sm text-muted-foreground">{perfil.descricao}</p>
                              </div>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(perfil.permissoes as Record<string, boolean>).map(([key, value]) =>
                                value ? (
                                  <Badge key={key} variant="secondary">
                                    {key}
                                  </Badge>
                                ) : null
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* URA */}
              <TabsContent value="ura" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuração da URA</CardTitle>
                    <CardDescription>Mensagens e opções do menu telefônico</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>URA Ativa</Label>
                      <Switch checked={uraForm.ativo} onCheckedChange={(checked) => setUraForm({ ...uraForm, ativo: checked })} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Mensagem de Boas-Vindas</Label>
                      <Textarea
                        value={uraForm.mensagem_boas_vindas}
                        onChange={(e) => setUraForm({ ...uraForm, mensagem_boas_vindas: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mensagem Fora do Expediente</Label>
                      <Textarea
                        value={uraForm.mensagem_fora_expediente}
                        onChange={(e) => setUraForm({ ...uraForm, mensagem_fora_expediente: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mensagem de Lotação</Label>
                      <Textarea
                        value={uraForm.mensagem_lotacao}
                        onChange={(e) => setUraForm({ ...uraForm, mensagem_lotacao: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <Separator />
                    <div>
                      <h4 className="font-medium mb-3">Opções do Menu</h4>
                      <div className="space-y-3">
                        {uraForm.opcoes.map((opcao, index) => (
                          <div key={index} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge>{opcao.tecla}</Badge>
                              <span className="font-medium">{opcao.destino}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{opcao.mensagem}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSalvarUra} className="w-full gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Configurações da URA
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* THALÍ */}
              <TabsContent value="ia" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Assistente Thalí</CardTitle>
                    <CardDescription>Configurações da Thalí e automação</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Robô de Pré-Atendimento</h4>
                          <p className="text-sm text-muted-foreground">Captar motivo do contato automaticamente</p>
                        </div>
                        <Switch checked={iaForm.robo_ativo} onCheckedChange={(checked) => setIaForm({ ...iaForm, robo_ativo: checked })} />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Sugestão de Respostas</h4>
                          <p className="text-sm text-muted-foreground">Thalí sugere respostas automáticas</p>
                        </div>
                        <Switch
                          checked={iaForm.assistente_config.sugestao_respostas}
                          onCheckedChange={(checked) =>
                            setIaForm({
                              ...iaForm,
                              assistente_config: { ...iaForm.assistente_config, sugestao_respostas: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Análise de Sentimento</h4>
                          <p className="text-sm text-muted-foreground">Detecta emoções nas mensagens</p>
                        </div>
                        <Switch
                          checked={iaForm.assistente_config.analise_sentimento}
                          onCheckedChange={(checked) =>
                            setIaForm({
                              ...iaForm,
                              assistente_config: { ...iaForm.assistente_config, analise_sentimento: checked },
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Identificação de Urgência</h4>
                          <p className="text-sm text-muted-foreground">Prioriza casos urgentes automaticamente</p>
                        </div>
                        <Switch
                          checked={iaForm.assistente_config.identificacao_urgencia}
                          onCheckedChange={(checked) =>
                            setIaForm({
                              ...iaForm,
                              assistente_config: { ...iaForm.assistente_config, identificacao_urgencia: checked },
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={handleSalvarIA} className="w-full gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Configurações da Thalí
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ALERTAS */}
              <TabsContent value="alertas" className="mt-0 space-y-4">
                {/* Seção 1: Notificações e Alertas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notificações e Alertas
                    </CardTitle>
                    <CardDescription>Ativar/desativar tipos de alertas e configurar notificações push</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { id: 'fila_alta', nome: 'Fila alta', desc: 'Quando a fila de espera exceder o limite' },
                      { id: 'nps_baixo', nome: 'NPS baixo', desc: 'Quando o NPS cair abaixo do esperado' },
                      { id: 'sem_resposta', nome: 'Paciente sem resposta', desc: 'Tempo sem resposta acima do limite' },
                      { id: 'tma_acima', nome: 'Tempo médio acima da meta', desc: 'TMA excedeu a meta configurada' },
                      { id: 'ligacao_perdida', nome: 'Ligação perdida', desc: 'Chamada não atendida' },
                    ].map((alerta) => (
                      <div key={alerta.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-sm">{alerta.nome}</h4>
                          <p className="text-xs text-muted-foreground">{alerta.desc}</p>
                        </div>
                        <Switch
                          checked={alertasConfig[alerta.id as keyof typeof alertasConfig]?.ativo ?? true}
                          onCheckedChange={(checked) =>
                            setAlertasConfig({
                              ...alertasConfig,
                              [alerta.id]: { ...alertasConfig[alerta.id as keyof typeof alertasConfig], ativo: checked },
                            })
                          }
                        />
                      </div>
                    ))}
                    
                    <Separator />
                    <div>
                      <h4 className="font-medium text-sm mb-2">Notificações Push</h4>
                      <p className="text-xs text-muted-foreground mb-3">Quais alertas aparecem como notificação na tela</p>
                      <div className="space-y-2">
                        {['Fila alta', 'NPS baixo', 'Paciente sem resposta', 'Ligação perdida'].map((nome) => (
                          <div key={nome} className="flex items-center justify-between py-2 border-b last:border-0">
                            <span className="text-sm">{nome}</span>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seção 2: Limites e Sensibilidades */}
                <Card>
                  <CardHeader>
                    <CardTitle>Limites e Sensibilidades</CardTitle>
                    <CardDescription>Defina os limiares para disparo de alertas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tempo crítico de fila (minutos)</Label>
                        <Input
                          type="number"
                          value={alertasConfig.fila_alta.limite}
                          onChange={(e) =>
                            setAlertasConfig({
                              ...alertasConfig,
                              fila_alta: { ...alertasConfig.fila_alta, limite: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tempo sem resposta (minutos)</Label>
                        <Input
                          value={alertasConfig.tempo_resposta_alto.limite}
                          onChange={(e) =>
                            setAlertasConfig({
                              ...alertasConfig,
                              tempo_resposta_alto: { ...alertasConfig.tempo_resposta_alto, limite: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sensibilidade de sentimento</Label>
                        <div className="flex gap-2">
                          {['Baixa', 'Média', 'Alta'].map((nivel) => (
                            <Badge
                              key={nivel}
                              variant={nivel === 'Média' ? 'default' : 'outline'}
                              className="cursor-pointer"
                            >
                              {nivel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Sensibilidade de pico de demanda</Label>
                        <div className="flex gap-2">
                          {['Baixa', 'Média', 'Alta'].map((nivel) => (
                            <Badge
                              key={nivel}
                              variant={nivel === 'Média' ? 'default' : 'outline'}
                              className="cursor-pointer"
                            >
                              {nivel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>NPS baixo para alerta (≤)</Label>
                        <Input
                          type="number"
                          value={alertasConfig.nps_baixo.limite}
                          onChange={(e) =>
                            setAlertasConfig({
                              ...alertasConfig,
                              nps_baixo: { ...alertasConfig.nps_baixo, limite: parseInt(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>NPS alto para reconhecimento (≥)</Label>
                        <Input type="number" defaultValue={9} />
                      </div>
                    </div>

                    <Button className="w-full gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Configurações de Alertas
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API */}
              <TabsContent value="api" className="mt-0 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chave de API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Chave de Autenticação</Label>
                      <div className="flex gap-2">
                        <Input value={apiConfig.chave_api} readOnly className="font-mono" />
                        <Button variant="outline">Regenerar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Endpoints Disponíveis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {apiConfig.endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <h4 className="font-medium">{endpoint.nome}</h4>
                            <code className="text-sm text-muted-foreground">{endpoint.url}</code>
                          </div>
                          <Switch checked={endpoint.ativo} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Webhooks</CardTitle>
                    <CardDescription>Notificações de eventos via HTTP</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {apiConfig.webhooks.map((webhook, index) => (
                        <div key={index} className="space-y-2 p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Badge>{webhook.evento}</Badge>
                            <Switch checked={webhook.ativo} />
                          </div>
                          <Input value={webhook.url} className="text-sm font-mono" />
                        </div>
                      ))}
                      <Button variant="outline" className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar Webhook
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* CHAT INTERNO */}
              <TabsContent value="chat-interno" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessagesSquare className="h-5 w-5" />
                      Chat Interno da Equipe
                    </CardTitle>
                    <CardDescription>
                      Visualize e participe das conversas internas entre colaboradores de todos os setores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChatInternoPanel open={true} onOpenChange={() => {}} modoGestao={true} />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
