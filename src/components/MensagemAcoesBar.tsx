import { Copy, Forward, Smile, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MensagemAcoesBarProps {
  mensagem: {
    id: string;
    texto: string;
    autor: string;
    horario: string;
  };
  onClose: () => void;
  onEncaminhar?: () => void;
  onReagir?: (emoji: string) => void;
  onFavoritar?: (opcao: "historico" | "nota", nota?: string) => void;
  onOpenEncaminharDialog?: () => void;
}

const EMOJIS_RAPIDOS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export const MensagemAcoesBar = ({
  mensagem,
  onClose,
  onEncaminhar,
  onReagir,
  onFavoritar,
  onOpenEncaminharDialog,
}: MensagemAcoesBarProps) => {
  const [favoritoDialogOpen, setFavoritoDialogOpen] = useState(false);
  const [opcaoFavorito, setOpcaoFavorito] = useState<"historico" | "nota">("historico");
  const [notaTexto, setNotaTexto] = useState("");

  const handleCopiar = () => {
    const texto = mensagem.texto || "📎 Mídia";
    navigator.clipboard.writeText(texto);
    toast.success("Mensagem copiada");
    onClose();
  };

  const handleReagir = (emoji: string) => {
    onReagir?.(emoji);
    toast.success(`Reação ${emoji} adicionada`);
    onClose();
  };

  const handleConfirmarFavorito = () => {
    if (opcaoFavorito === "nota" && !notaTexto.trim()) {
      toast.error("Digite uma nota");
      return;
    }
    
    onFavoritar?.(opcaoFavorito, opcaoFavorito === "nota" ? notaTexto : undefined);
    toast.success("Mensagem favoritada");
    setFavoritoDialogOpen(false);
    setNotaTexto("");
    onClose();
  };

  return (
    <>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg z-50 flex items-center gap-1 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopiar}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copiar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (onOpenEncaminharDialog) {
              onOpenEncaminharDialog();
            } else {
              onEncaminhar?.();
            }
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <Forward className="h-4 w-4" />
          Encaminhar
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Reagir
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" side="top">
            <div className="flex gap-1">
              {EMOJIS_RAPIDOS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReagir(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFavoritoDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          Favoritar
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Dialog de Favoritar */}
      <Dialog open={favoritoDialogOpen} onOpenChange={setFavoritoDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Favoritar mensagem</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground text-xs mb-1">Mensagem:</p>
              <p className="line-clamp-2">{mensagem.texto || "📎 Mídia"}</p>
            </div>

            <RadioGroup
              value={opcaoFavorito}
              onValueChange={(v) => setOpcaoFavorito(v as "historico" | "nota")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="historico" id="historico" />
                <Label htmlFor="historico">Adicionar no histórico</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nota" id="nota" />
                <Label htmlFor="nota">Adicionar nota</Label>
              </div>
            </RadioGroup>

            {opcaoFavorito === "nota" && (
              <Textarea
                placeholder="Digite sua nota..."
                value={notaTexto}
                onChange={(e) => setNotaTexto(e.target.value)}
                rows={3}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFavoritoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarFavorito}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
