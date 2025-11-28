import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGerarFigurinhaThali } from "@/hooks/useGerarFigurinhaThali";
import { Loader2, Sparkles, Smile, Heart, ThumbsUp, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const expressoesPreDefinidas = [
  { icone: Smile, label: "Sorrindo", valor: "smiling and welcoming" },
  { icone: Heart, label: "Carinhosa", valor: "caring and warm" },
  { icone: ThumbsUp, label: "Positiva", valor: "thumbs up and encouraging" },
  { icone: CheckCircle, label: "Confirmando", valor: "confirming and professional" },
  { icone: AlertCircle, label: "Atenta", valor: "attentive and focused" },
  { icone: Zap, label: "Energética", valor: "energetic and motivated" },
];

const contextosPreDefinidos = [
  "Atendimento excelente",
  "Estou analisando",
  "Conte comigo",
  "Tudo vai dar certo",
  "Ótimo trabalho",
  "Vamos resolver",
  "Paciente cuidado",
  "Equipe unida",
];

export const GeradorFigurinhasThali = () => {
  const [nome, setNome] = useState("");
  const [expressao, setExpressao] = useState("");
  const [contexto, setContexto] = useState("");
  const gerarFigurinha = useGerarFigurinhaThali();

  const handleGerarComPreset = (expressaoValor: string, contextoTexto: string) => {
    if (!nome.trim()) {
      setNome(`Thalí - ${contextoTexto}`);
    }
    setExpressao(expressaoValor);
    setContexto(contextoTexto);
  };

  const handleGerar = async () => {
    if (!nome.trim() || !expressao.trim()) {
      return;
    }

    await gerarFigurinha.mutateAsync({
      nome,
      expressao,
      contexto: contexto || undefined,
    });

    // Limpar campos após sucesso
    if (gerarFigurinha.isSuccess) {
      setNome("");
      setExpressao("");
      setContexto("");
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Gerador de Figurinhas da Thalí com IA</CardTitle>
        </div>
        <CardDescription>
          Crie figurinhas personalizadas da Thalí usando inteligência artificial
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Expressões Pré-definidas */}
        <div className="space-y-3">
          <Label>Expressões Rápidas</Label>
          <div className="grid grid-cols-3 gap-2">
            {expressoesPreDefinidas.map((exp) => {
              const Icone = exp.icone;
              return (
                <Button
                  key={exp.valor}
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => setExpressao(exp.valor)}
                >
                  <Icone className="h-4 w-4" />
                  {exp.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Contextos Pré-definidos */}
        <div className="space-y-3">
          <Label>Mensagens Sugeridas</Label>
          <ScrollArea className="h-24">
            <div className="flex flex-wrap gap-2">
              {contextosPreDefinidos.map((ctx) => (
                <Button
                  key={ctx}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setContexto(ctx);
                    if (!nome.trim()) setNome(`Thalí - ${ctx}`);
                  }}
                >
                  {ctx}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Figurinha *</Label>
            <Input
              id="nome"
              placeholder="Ex: Thalí - Conte comigo!"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expressao">Expressão/Emoção *</Label>
            <Input
              id="expressao"
              placeholder="Ex: smiling and welcoming, caring and warm"
              value={expressao}
              onChange={(e) => setExpressao(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Descreva a expressão ou emoção da Thalí (em inglês para melhor resultado)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contexto">Contexto/Mensagem (opcional)</Label>
            <Textarea
              id="contexto"
              placeholder="Ex: Atendimento excelente, Estou analisando os dados"
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Adicione contexto ou uma mensagem para a figurinha
            </p>
          </div>

          <Button
            onClick={handleGerar}
            disabled={gerarFigurinha.isPending || !nome.trim() || !expressao.trim()}
            className="w-full"
            size="lg"
          >
            {gerarFigurinha.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando figurinha com IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Gerar Figurinha da Thalí
              </>
            )}
          </Button>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">💡 Dicas para melhores resultados:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use expressões em inglês para descrições mais precisas</li>
              <li>Combine expressões e contextos pré-definidos para resultados rápidos</li>
              <li>Seja específico na descrição da emoção desejada</li>
              <li>A geração pode levar de 10 a 30 segundos</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
