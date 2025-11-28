import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { usePacotesFigurinhas, useFigurinhasByPacote } from "@/hooks/useFigurinhas";
import { Loader2 } from "lucide-react";

interface EmojiStickerPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onStickerSelect: (stickerUrl: string, stickerName: string) => void;
}

export const EmojiStickerPicker = ({
  onEmojiSelect,
  onStickerSelect,
}: EmojiStickerPickerProps) => {
  const [activeTab, setActiveTab] = useState("emojis");
  const [selectedPacote, setSelectedPacote] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  const { data: pacotes, isLoading: loadingPacotes } = usePacotesFigurinhas();
  const { data: figurinhas, isLoading: loadingFigurinhas } = useFigurinhasByPacote(selectedPacote);

  // Detectar tema dark/light
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    // Observer para mudanças de tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, []);

  // Selecionar primeiro pacote automaticamente quando mudar para abas de figurinhas
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === "institucional" && !selectedPacote && pacotes) {
      const institucional = pacotes.find(p => p.tipo === 'institucional');
      if (institucional) setSelectedPacote(institucional.id);
    } else if (value === "thali" && !selectedPacote && pacotes) {
      const thali = pacotes.find(p => p.tipo === 'thali');
      if (thali) setSelectedPacote(thali.id);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  const handleStickerClick = (url: string, name: string) => {
    onStickerSelect(url, name);
  };

  return (
    <div className="w-[350px] bg-background border border-border rounded-lg shadow-lg">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emojis">Emojis</TabsTrigger>
          <TabsTrigger value="institucional">Empresa</TabsTrigger>
          <TabsTrigger value="thali">Thalí</TabsTrigger>
        </TabsList>

        <TabsContent value="emojis" className="p-0 m-0">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height={350}
            theme={isDark ? Theme.DARK : Theme.LIGHT}
            searchPlaceHolder="Buscar emoji..."
            previewConfig={{ showPreview: false }}
          />
        </TabsContent>

        <TabsContent value="institucional" className="p-0 m-0">
          <ScrollArea className="h-[350px]">
            {loadingPacotes || loadingFigurinhas ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : figurinhas && figurinhas.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 p-4">
                {figurinhas.map((fig) => (
                  <button
                    key={fig.id}
                    onClick={() => handleStickerClick(fig.url_imagem, fig.nome)}
                    className="aspect-square rounded-lg hover:bg-muted/50 transition-colors p-2 group relative"
                    title={fig.nome}
                  >
                    <img
                      src={fig.url_imagem}
                      alt={fig.nome}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-xs text-center px-1">{fig.nome}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Nenhuma figurinha disponível
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="thali" className="p-0 m-0">
          <ScrollArea className="h-[350px]">
            {loadingPacotes || loadingFigurinhas ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : figurinhas && figurinhas.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 p-4">
                {figurinhas.map((fig) => (
                  <button
                    key={fig.id}
                    onClick={() => handleStickerClick(fig.url_imagem, fig.nome)}
                    className="aspect-square rounded-lg hover:bg-muted/50 transition-colors p-2 group relative"
                    title={fig.nome}
                  >
                    <img
                      src={fig.url_imagem}
                      alt={fig.nome}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <p className="text-white text-xs text-center px-1">{fig.nome}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Nenhuma figurinha da Thalí disponível
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
