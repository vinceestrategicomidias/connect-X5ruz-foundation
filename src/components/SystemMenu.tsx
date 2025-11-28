import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Building,
  Users,
  ShieldCheck,
  Phone,
  Bot,
  FileText,
  BarChart3,
  Map,
  UserCheck,
  Bell,
  Code2,
  Save,
  Plus,
  Copy,
  RefreshCw,
} from "lucide-react";
import { ValidacoesPerfilPanel } from "./ValidacoesPerfilPanel";
import { ApiWebhooksManager } from "./ApiWebhooksManager";
import { ApiLogsViewer } from "./ApiLogsViewer";
import { ApiDocsPanel } from "./ApiDocsPanel";
import { IAConfigPanel } from "./IAConfigPanel";
import { IAAlertasPanel } from "./IAAlertasPanel";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useEmpresas, useAtualizarEmpresa } from "@/hooks/useEmpresas";
import { useUnidades, useCriarUnidade } from "@/hooks/useUnidades";
import { useSetores } from "@/hooks/useSetores";
import { usePerfisAcesso } from "@/hooks/usePerfisAcesso";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useMensageriaConfig, useAtualizarMensageriaConfig } from "@/hooks/useMensageriaConfig";
import { useUraConfig, useAtualizarUraConfig } from "@/hooks/useUraConfig";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SystemMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MenuSection =
  | "empresa"
  | "unidades"
  | "setores"
  | "usuarios"
  | "perfis"
  | "validacoes"
  | "ura"
  | "mensageria"
  | "relatorios"
  | "dashboard"
  | "alertas"
  | "api";

const menuItems = [
  { id: "dashboard" as MenuSection, label: "Dashboard", icon: BarChart3 },
  { id: "relatorios" as MenuSection, label: "Relatórios", icon: FileText },
  { id: "empresa" as MenuSection, label: "Empresa", icon: Building2 },
  { id: "unidades" as MenuSection, label: "Unidades", icon: Building },
  { id: "setores" as MenuSection, label: "Setores", icon: Map },
  { id: "usuarios" as MenuSection, label: "Usuários", icon: Users },
  { id: "perfis" as MenuSection, label: "Perfis de Acesso", icon: ShieldCheck },
  { id: "validacoes" as MenuSection, label: "Validações de Perfil", icon: UserCheck, requiresCoordenacao: true },
  { id: "ura" as MenuSection, label: "URA (Telefonia)", icon: Phone },
  { id: "mensageria" as MenuSection, label: "Thalí e Mensageria", icon: Bot },
  { id: "alertas" as MenuSection, label: "Alertas", icon: Bell },
  { id: "api" as MenuSection, label: "API e Webhooks", icon: Code2 },
];

export const SystemMenu = ({ open, onOpenChange }: SystemMenuProps) => {
  const { isCoordenacao, isGestor } = useAtendenteContext();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<MenuSection>("empresa");
  const [validacoesOpen, setValidacoesOpen] = useState(false);
  
  // Hooks de dados
  const { data: empresas } = useEmpresas();
  const { data: unidades } = useUnidades();
  const { data: setores } = useSetores();
  const { data: perfis } = usePerfisAcesso();
  const { data: atendentes } = useAtendentes();
  const { data: mensageriaConfig } = useMensageriaConfig();
  const { data: uraConfig } = useUraConfig();
  
  // Mutations
  const atualizarEmpresa = useAtualizarEmpresa();
  const criarUnidade = useCriarUnidade();
  const atualizarMensageria = useAtualizarMensageriaConfig();
  const atualizarUra = useAtualizarUraConfig();
  
  // Estados de formulários
  const [empresaForm, setEmpresaForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    responsavel: "",
  });
  
  const [novaUnidade, setNovaUnidade] = useState({
    nome: "",
    codigo_interno: "",
    endereco: "",
    fuso_horario: "GMT-3",
  });
  
  const [uraForm, setUraForm] = useState({
    mensagem_boas_vindas: "",
    mensagem_espera: "",
    mensagem_fora_expediente: "",
    ativo: true,
  });
  
  const [iaForm, setIaForm] = useState({
    robo_ativo: false,
    ia_ativa: false,
  });
  
  const [alertasConfig, setAlertasConfig] = useState({
    fila_alta: 12,
    nps_baixo: 7,
    tempo_resposta_alto: 6,
  });
  
  const [apiConfig, setApiConfig] = useState({
    chave_api: "LIRUZ-API-KEY-001",
  });
  
  // Handlers
  const handleSalvarEmpresa = () => {
    if (empresas && empresas[0]) {
      atualizarEmpresa.mutate({ id: empresas[0].id, dados: empresaForm });
    }
  };
  
  const handleCriarUnidade = () => {
    criarUnidade.mutate(novaUnidade);
    setNovaUnidade({ nome: "", codigo_interno: "", endereco: "", fuso_horario: "GMT-3" });
  };
  
  const handleSalvarUra = () => {
    if (uraConfig && uraConfig[0]) {
      atualizarUra.mutate({ id: uraConfig[0].id, dados: uraForm });
    }
  };
  
  const handleSalvarIA = () => {
    if (mensageriaConfig && mensageriaConfig[0]) {
      atualizarMensageria.mutate({ id: mensageriaConfig[0].id, dados: iaForm });
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "empresa":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Cadastro da Empresa</h3>
              <p className="text-sm text-muted-foreground">
                Configure os dados da sua empresa
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Empresa</Label>
                    <Input
                      value={empresaForm.nome}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })}
                      placeholder="Grupo Liruz"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={empresaForm.cnpj}
                      onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })}
                      placeholder="28.443.771/0001-92"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Endereço Corporativo</Label>
                  <Input
                    value={empresaForm.endereco}
                    onChange={(e) => setEmpresaForm({ ...empresaForm, endereco: e.target.value })}
                    placeholder="Av. Nossa Senhora da Penha, 1500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input
                    value={empresaForm.responsavel}
                    onChange={(e) => setEmpresaForm({ ...empresaForm, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                
                <Button onClick={handleSalvarEmpresa} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dados da Empresa
                </Button>
              </CardContent>
            </Card>
            
            {empresas && empresas[0] && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Atuais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nome:</span>
                    <span className="font-medium">{empresas[0].nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CNPJ:</span>
                    <span className="font-medium">{empresas[0].cnpj || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Endereço:</span>
                    <span className="font-medium text-right">{empresas[0].endereco || "—"}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "unidades":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Unidades Empresariais</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie as unidades da sua empresa
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Unidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome da Unidade</Label>
                    <Input
                      value={novaUnidade.nome}
                      onChange={(e) => setNovaUnidade({ ...novaUnidade, nome: e.target.value })}
                      placeholder="Unidade São Paulo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Código</Label>
                    <Input
                      value={novaUnidade.codigo_interno}
                      onChange={(e) => setNovaUnidade({ ...novaUnidade, codigo_interno: e.target.value })}
                      placeholder="SP01"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={novaUnidade.endereco}
                    onChange={(e) => setNovaUnidade({ ...novaUnidade, endereco: e.target.value })}
                    placeholder="Av. Paulista, 1000"
                  />
                </div>
                
                <Button onClick={handleCriarUnidade} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Unidade
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Unidades Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {unidades && unidades.map((unidade) => (
                      <div key={unidade.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{unidade.nome}</h4>
                          <Badge variant={unidade.ativo ? "default" : "secondary"}>
                            {unidade.ativo ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Código: {unidade.codigo_interno || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {unidade.endereco || "Endereço não informado"}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case "setores":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Gestão de Setores</h3>
              <p className="text-sm text-muted-foreground">
                Setores cadastrados no sistema
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Setores Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {setores && setores.map((setor) => (
                    <div key={setor.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: setor.cor || "#888" }} />
                        <h4 className="font-semibold">{setor.nome}</h4>
                      </div>
                      {setor.descricao && (
                        <p className="text-sm text-muted-foreground">{setor.descricao}</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {setor.recebe_ligacoes && (
                          <Badge variant="outline" className="text-xs">
                            <Phone className="h-3 w-3 mr-1" />
                            Ligações
                          </Badge>
                        )}
                        {setor.recebe_mensagens && (
                          <Badge variant="outline" className="text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            Mensagens
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "usuarios":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Gestão de Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Usuários cadastrados no sistema ({atendentes?.length || 0})
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {atendentes && atendentes.map((usuario) => (
                      <div key={usuario.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarImage src={usuario.avatar || undefined} />
                          <AvatarFallback>{usuario.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{usuario.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            {usuario.cargo}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {usuario.cargo}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        );

      case "perfis":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Perfis de Acesso</h3>
              <p className="text-sm text-muted-foreground">
                Configure permissões por perfil
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Perfis Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {perfis && perfis.map((perfil) => (
                    <div key={perfil.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{perfil.nome}</h4>
                        <Badge>{perfil.nome}</Badge>
                      </div>
                      {perfil.descricao && (
                        <p className="text-sm text-muted-foreground">{perfil.descricao}</p>
                      )}
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Permissões:</p>
                        <div className="flex flex-wrap gap-2">
                          {perfil.permissoes && Object.entries(perfil.permissoes).filter(([_, v]) => v).map(([key]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "validacoes":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validações de Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Aprove ou reprove alterações solicitadas pelos usuários em seus perfis.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setValidacoesOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Abrir Painel de Validações
              </button>
            </div>
          </div>
        );

      case "ura":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Configuração da URA</h3>
              <p className="text-sm text-muted-foreground">
                Configure mensagens e opções da URA telefônica
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Configurações de URA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>URA Ativa</Label>
                    <p className="text-sm text-muted-foreground">Ativar/desativar sistema de URA</p>
                  </div>
                  <Switch
                    checked={uraForm.ativo}
                    onCheckedChange={(checked) => setUraForm({ ...uraForm, ativo: checked })}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Mensagem de Boas-vindas</Label>
                  <Textarea
                    value={uraForm.mensagem_boas_vindas}
                    onChange={(e) => setUraForm({ ...uraForm, mensagem_boas_vindas: e.target.value })}
                    placeholder="Bem-vindo ao Grupo Liruz..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Mensagem de Espera</Label>
                  <Textarea
                    value={uraForm.mensagem_espera}
                    onChange={(e) => setUraForm({ ...uraForm, mensagem_espera: e.target.value })}
                    placeholder="Por favor, aguarde..."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Mensagem Fora do Expediente</Label>
                  <Textarea
                    value={uraForm.mensagem_fora_expediente}
                    onChange={(e) => setUraForm({ ...uraForm, mensagem_fora_expediente: e.target.value })}
                    placeholder="Nosso horário de atendimento é..."
                    rows={2}
                  />
                </div>
                
                <Button onClick={handleSalvarUra} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações URA
                </Button>
              </CardContent>
            </Card>
            
            {uraConfig && uraConfig[0] && (
              <Card>
                <CardHeader>
                  <CardTitle>Opções do Menu URA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Tecla 1 → Pré-venda</p>
                      <p className="text-sm text-muted-foreground">Redirecionando para Pré-Venda</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Tecla 2 → Convênios</p>
                      <p className="text-sm text-muted-foreground">Encaminhando para Convênios</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Tecla 3 → Comercial Connect</p>
                      <p className="text-sm text-muted-foreground">Transferindo para Comercial Connect</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "mensageria":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Thalí e Mensageria</h3>
              <p className="text-sm text-muted-foreground">
                Configure a Thalí e automação de mensagens
              </p>
            </div>
            
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="config">Configurações</TabsTrigger>
                <TabsTrigger value="alertas">Alertas da Thalí</TabsTrigger>
                <TabsTrigger value="mensageria">Mensageria</TabsTrigger>
              </TabsList>

              <TabsContent value="config">
                <IAConfigPanel />
              </TabsContent>

              <TabsContent value="alertas">
                <IAAlertasPanel />
              </TabsContent>

              <TabsContent value="mensageria">
                <Card>
                  <CardHeader>
                    <CardTitle>Integrações de Mensageria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-semibold">WhatsApp Business</h4>
                      <p className="text-sm text-muted-foreground">
                        Integração em desenvolvimento
                      </p>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg space-y-2">
                      <h4 className="font-semibold">Telegram</h4>
                      <p className="text-sm text-muted-foreground">
                        Integração em desenvolvimento
                      </p>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );

      case "relatorios":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Relatórios</h3>
            <p className="text-sm text-muted-foreground">
              Gere relatórios de atendimento, produtividade, ligações por unidade, setor e atendente.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dashboard para Gestão</h3>
            <p className="text-sm text-muted-foreground">
              Dashboard full-screen com métricas em tempo real. Ideal para monitores de operação.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "alertas":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Configuração de Alertas</h3>
              <p className="text-sm text-muted-foreground">
                Configure limites e notificações
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Limites de Alertas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Fila Alta (nº de pessoas)</Label>
                  <Input
                    type="number"
                    value={alertasConfig.fila_alta}
                    onChange={(e) => setAlertasConfig({ ...alertasConfig, fila_alta: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Alerta quando fila ultrapassar este número</p>
                </div>
                
                <div className="space-y-2">
                  <Label>NPS Baixo (nota mínima)</Label>
                  <Input
                    type="number"
                    value={alertasConfig.nps_baixo}
                    onChange={(e) => setAlertasConfig({ ...alertasConfig, nps_baixo: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Alerta quando NPS for menor que esta nota</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Tempo de Resposta Alto (minutos)</Label>
                  <Input
                    type="number"
                    value={alertasConfig.tempo_resposta_alto}
                    onChange={(e) => setAlertasConfig({ ...alertasConfig, tempo_resposta_alto: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Alerta quando tempo ultrapassar este limite</p>
                </div>
                
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações de Alertas
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Alertas Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Fila Alta</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">NPS Baixo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Tempo de Resposta Alto</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Previsão de Pico</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border rounded">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Relatório Crítico</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "api":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">API e Integrações</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie chaves API, webhooks, logs e documentação
              </p>
            </div>
            
            <Tabs defaultValue="chave" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chave">Chave API</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="docs">Documentação</TabsTrigger>
              </TabsList>

              <TabsContent value="chave" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chave API Ativa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          value={apiConfig.chave_api}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use esta chave no header: Authorization: Bearer {apiConfig.chave_api}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label>Limites</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 border rounded-lg">
                          <div className="text-2xl font-bold">1000</div>
                          <div className="text-xs text-muted-foreground">req/minuto</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-2xl font-bold">250</div>
                          <div className="text-xs text-muted-foreground">burst/5s</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Gerar Nova Chave
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="webhooks">
                <ApiWebhooksManager />
              </TabsContent>

              <TabsContent value="logs">
                <ApiLogsViewer />
              </TabsContent>

              <TabsContent value="docs">
                <ApiDocsPanel />
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[900px] rounded-none">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-xl">Sistema de Gestão</DrawerTitle>
          </DrawerHeader>
          
          <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/20">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const requiresCoordenacao = (item as any).requiresCoordenacao;
                    
                    // Hide validações menu item if user is not coordenação or gestor
                    if (requiresCoordenacao && !isCoordenacao && !isGestor) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === "dashboard") {
                            navigate("/dashboard");
                            onOpenChange(false);
                          } else {
                            setSelectedSection(item.id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          selectedSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">{renderContent()}</div>
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      <ValidacoesPerfilPanel open={validacoesOpen} onOpenChange={setValidacoesOpen} />
    </>
  );
};
