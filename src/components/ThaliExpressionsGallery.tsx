import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThaliAvatar, type ThaliExpression } from "./ThaliAvatar";
import { Badge } from "@/components/ui/badge";

const expressions: Array<{
  expression: ThaliExpression;
  label: string;
  description: string;
  contexts: string[];
}> = [
  {
    expression: "neutral",
    label: "Neutro",
    description: "Expressão padrão para situações normais",
    contexts: ["Análise em andamento", "Estado padrão", "Aguardando interação"]
  },
  {
    expression: "pensativa",
    label: "Pensativa",
    description: "Quando Thalí está analisando ou processando",
    contexts: ["Analisando sentimento", "Gerando sugestões", "Processando dados"]
  },
  {
    expression: "alertando",
    label: "Alerta",
    description: "Para situações urgentes ou negativas",
    contexts: ["Sentimento negativo", "Urgência alta", "Alerta crítico"]
  },
  {
    expression: "feliz",
    label: "Feliz",
    description: "Para situações positivas ou bem-sucedidas",
    contexts: ["Sentimento positivo", "Urgência baixa", "Sucesso confirmado"]
  }
];

export const ThaliExpressionsGallery = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ThaliAvatar size="sm" />
          Galeria de Expressões da Thalí
        </CardTitle>
        <CardDescription>
          Diferentes expressões usadas pela Thalí conforme o contexto da interação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expressions.map((item) => (
            <div
              key={item.expression}
              className="flex gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <ThaliAvatar 
                  size="lg" 
                  expression={item.expression}
                  processing={item.expression === "pensativa"}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-semibold">{item.label}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.contexts.map((context, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {context}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};