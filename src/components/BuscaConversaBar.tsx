import { useState, useEffect, useCallback } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BuscaConversaBarProps {
  open: boolean;
  onClose: () => void;
  mensagens: Array<{
    id: string;
    texto: string;
    autor: string;
    horario: string;
  }>;
  onResultadoClick: (mensagemId: string, index: number) => void;
}

export const BuscaConversaBar = ({
  open,
  onClose,
  mensagens,
  onResultadoClick,
}: BuscaConversaBarProps) => {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState<string[]>([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  const buscar = useCallback(
    (texto: string) => {
      if (!texto.trim()) {
        setResultados([]);
        return;
      }

      const termoLower = texto.toLowerCase();
      const encontrados = mensagens
        .filter((m) => m.texto.toLowerCase().includes(termoLower))
        .map((m) => m.id);

      setResultados(encontrados);
      setIndiceAtual(0);

      if (encontrados.length > 0) {
        onResultadoClick(encontrados[0], 0);
      }
    },
    [mensagens, onResultadoClick]
  );

  useEffect(() => {
    buscar(termo);
  }, [termo, buscar]);

  const irParaProximo = () => {
    if (resultados.length === 0) return;
    const novoIndice = (indiceAtual + 1) % resultados.length;
    setIndiceAtual(novoIndice);
    onResultadoClick(resultados[novoIndice], novoIndice);
  };

  const irParaAnterior = () => {
    if (resultados.length === 0) return;
    const novoIndice = indiceAtual === 0 ? resultados.length - 1 : indiceAtual - 1;
    setIndiceAtual(novoIndice);
    onResultadoClick(resultados[novoIndice], novoIndice);
  };

  const handleClose = () => {
    setTermo("");
    setResultados([]);
    setIndiceAtual(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="absolute top-16 left-0 right-0 bg-card border-b border-border p-3 z-10 flex items-center gap-2 shadow-md">
      <Search className="h-4 w-4 text-muted-foreground shrink-0" />
      <Input
        autoFocus
        placeholder="Digite uma palavra ou frase"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        className="flex-1"
      />
      
      {termo && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {resultados.length > 0
            ? `${indiceAtual + 1} de ${resultados.length}`
            : "Nenhum resultado"}
        </span>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={irParaAnterior}
          disabled={resultados.length === 0}
          title="Anterior"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={irParaProximo}
          disabled={resultados.length === 0}
          title="Próximo"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleClose}
          title="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
