import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ApiDocsPanel = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints = [
    {
      nome: "Criar Paciente",
      metodo: "POST",
      url: "/api/pacientes/create",
      descricao: "Cria um novo paciente no sistema",
      exemplo: `curl -X POST \\
  https://seu-projeto.supabase.co/functions/v1/api-pacientes-create \\
  -H "Authorization: Bearer LIRUZ-API-KEY-001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nome": "Ana Paula Santos",
    "cpf": "145.228.987-33",
    "telefone": "+55 11 9 8888-2121",
    "email": "ana@example.com",
    "setor_inicial": "Pré-venda"
  }'`,
      resposta: `{
  "status": "sucesso",
  "paciente_id": "550e8400-e29b-41d4-a716-446655440000",
  "dados": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Ana Paula Santos",
    "telefone": "+55 11 9 8888-2121",
    "status": "fila"
  }
}`
    },
    {
      nome: "Iniciar Atendimento",
      metodo: "POST",
      url: "/api/atendimentos/start",
      descricao: "Inicia um novo atendimento para um paciente",
      exemplo: `curl -X POST \\
  https://seu-projeto.supabase.co/functions/v1/api-atendimentos-start \\
  -H "Authorization: Bearer LIRUZ-API-KEY-001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "paciente_id": "550e8400-e29b-41d4-a716-446655440000",
    "setor": "Pré-venda",
    "origem": "API"
  }'`,
      resposta: `{
  "status": "iniciado",
  "atendimento_id": "AT-44128",
  "paciente": "Ana Paula Santos"
}`
    },
    {
      nome: "Enviar Mensagem",
      metodo: "POST",
      url: "/api/chat/send",
      descricao: "Envia uma mensagem para um atendimento",
      exemplo: `curl -X POST \\
  https://seu-projeto.supabase.co/functions/v1/api-chat-send \\
  -H "Authorization: Bearer LIRUZ-API-KEY-001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "atendimento_id": "AT-44128",
    "mensagem": "Olá! Obrigado por entrar em contato.",
    "tipo": "texto"
  }'`,
      resposta: `{
  "status": "mensagem_enviada",
  "mensagem_id": "msg-12345"
}`
    },
    {
      nome: "Listar Setores",
      metodo: "GET",
      url: "/api/setores",
      descricao: "Lista todos os setores ativos",
      exemplo: `curl -X GET \\
  https://seu-projeto.supabase.co/functions/v1/api-setores \\
  -H "Authorization: Bearer LIRUZ-API-KEY-001"`,
      resposta: `{
  "setores": [
    "Pré-venda",
    "Venda",
    "Pós-venda",
    "Convênios",
    "Comercial CRM",
    "Comercial Connect"
  ]
}`
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-6 p-6">
        <div>
          <h2 className="text-2xl font-bold">Documentação da API</h2>
          <p className="text-muted-foreground mt-2">
            API REST completa para integração com o Connect - Grupo Liruz
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Todas as requisições devem incluir o header de autenticação:
              </p>
              <div className="bg-muted p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                <code>Authorization: Bearer LIRUZ-API-KEY-001</code>
                <button
                  onClick={() => copyToClipboard("Authorization: Bearer LIRUZ-API-KEY-001", "auth")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedEndpoint === "auth" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">Rate Limit: 1000 req/min</Badge>
              <Badge variant="outline">Burst: 250 req/5s</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Endpoints Disponíveis</h3>
          {endpoints.map((endpoint, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{endpoint.nome}</CardTitle>
                  <Badge variant={endpoint.metodo === "GET" ? "secondary" : "default"}>
                    {endpoint.metodo}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{endpoint.descricao}</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="exemplo" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="exemplo">Exemplo</TabsTrigger>
                    <TabsTrigger value="resposta">Resposta</TabsTrigger>
                  </TabsList>
                  <TabsContent value="exemplo" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">cURL</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.exemplo, `exemplo-${index}`)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedEndpoint === `exemplo-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{endpoint.exemplo}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="resposta" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">JSON Response</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(endpoint.resposta, `resposta-${index}`)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedEndpoint === `resposta-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{endpoint.resposta}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Códigos de Status HTTP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">200 OK</code>
                <span className="text-sm text-muted-foreground">Requisição bem-sucedida</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">400 Bad Request</code>
                <span className="text-sm text-muted-foreground">Parâmetros inválidos</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">401 Unauthorized</code>
                <span className="text-sm text-muted-foreground">Token inválido ou ausente</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">404 Not Found</code>
                <span className="text-sm text-muted-foreground">Recurso não encontrado</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">409 Conflict</code>
                <span className="text-sm text-muted-foreground">Recurso já existe</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">429 Too Many Requests</code>
                <span className="text-sm text-muted-foreground">Rate limit excedido</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <code className="text-sm">500 Internal Server Error</code>
                <span className="text-sm text-muted-foreground">Erro no servidor</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};
