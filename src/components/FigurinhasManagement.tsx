import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePacotesFigurinhas, useFigurinhasByPacote, useUploadFigurinha } from "@/hooks/useFigurinhas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const FigurinhasManagement = () => {
  const [selectedPacote, setSelectedPacote] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [figurinhaNome, setFigurinhaNome] = useState("");
  const [figurinhaDescricao, setFigurinhaDescricao] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: pacotes, isLoading: loadingPacotes } = usePacotesFigurinhas();
  const { data: figurinhas, isLoading: loadingFigurinhas } = useFigurinhasByPacote(selectedPacote);
  const uploadFigurinha = useUploadFigurinha();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem");
        return;
      }
      setUploadFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedPacote || !figurinhaNome.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    await uploadFigurinha.mutateAsync({
      pacoteId: selectedPacote,
      nome: figurinhaNome,
      descricao: figurinhaDescricao,
      file: uploadFile,
    });

    // Limpar campos
    setUploadFile(null);
    setPreviewUrl(null);
    setFigurinhaNome("");
    setFigurinhaDescricao("");
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Gerenciar Figurinhas</CardTitle>
        <CardDescription>
          Adicione novas figurinhas aos pacotes institucionais e da Thalí
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Nova Figurinha</TabsTrigger>
            <TabsTrigger value="existing">Figurinhas Existentes</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pacote">Pacote *</Label>
              <select
                id="pacote"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedPacote || ""}
                onChange={(e) => setSelectedPacote(e.target.value)}
              >
                <option value="">Selecione um pacote</option>
                {pacotes?.map((pacote) => (
                  <option key={pacote.id} value={pacote.id}>
                    {pacote.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Imagem da Figurinha *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {previewUrl && (
                  <div className="w-20 h-20 border border-border rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Recomendado: PNG ou WebP com fundo transparente, 512x512px
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Figurinha *</Label>
              <Input
                id="nome"
                placeholder="Ex: Thalí - Conte comigo!"
                value={figurinhaNome}
                onChange={(e) => setFigurinhaNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input
                id="descricao"
                placeholder="Ex: Thalí sorrindo e acolhedora"
                value={figurinhaDescricao}
                onChange={(e) => setFigurinhaDescricao(e.target.value)}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploadFigurinha.isPending || !uploadFile || !selectedPacote || !figurinhaNome.trim()}
              className="w-full"
            >
              {uploadFigurinha.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fazendo upload...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Adicionar Figurinha
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="existing">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pacote-view">Pacote</Label>
                <select
                  id="pacote-view"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedPacote || ""}
                  onChange={(e) => setSelectedPacote(e.target.value)}
                >
                  <option value="">Selecione um pacote</option>
                  {pacotes?.map((pacote) => (
                    <option key={pacote.id} value={pacote.id}>
                      {pacote.nome}
                    </option>
                  ))}
                </select>
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                {loadingFigurinhas ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : figurinhas && figurinhas.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {figurinhas.map((fig) => (
                      <div
                        key={fig.id}
                        className="aspect-square border border-border rounded-lg p-2 flex flex-col gap-2"
                      >
                        <img
                          src={fig.url_imagem}
                          alt={fig.nome}
                          className="w-full h-32 object-contain"
                        />
                        <div className="text-center">
                          <p className="text-sm font-medium truncate">{fig.nome}</p>
                          {fig.descricao && (
                            <p className="text-xs text-muted-foreground truncate">
                              {fig.descricao}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      {selectedPacote
                        ? "Nenhuma figurinha neste pacote"
                        : "Selecione um pacote para ver as figurinhas"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
