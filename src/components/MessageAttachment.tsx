import { FileText, Download, Play, Image as ImageIcon, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface MessageAttachmentProps {
  tipo: string;
  nomeArquivo: string;
  urlStorage: string;
  tamanhoBytes: number;
  mimeType: string;
}

export const MessageAttachment = ({
  tipo,
  nomeArquivo,
  urlStorage,
  tamanhoBytes,
  mimeType,
}: MessageAttachmentProps) => {
  const [imageOpen, setImageOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = () => {
    window.open(urlStorage, '_blank');
  };

  // Renderizar imagem
  if (tipo === 'imagem') {
    return (
      <>
        <div 
          className="relative group cursor-pointer rounded-lg overflow-hidden max-w-[300px]"
          onClick={() => setImageOpen(true)}
        >
          <img
            src={urlStorage}
            alt={nomeArquivo}
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="max-w-4xl">
            <img
              src={urlStorage}
              alt={nomeArquivo}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Renderizar vídeo
  if (tipo === 'video') {
    return (
      <div className="relative rounded-lg overflow-hidden max-w-[300px] bg-black">
        <video
          controls
          className="w-full h-auto"
          preload="metadata"
        >
          <source src={urlStorage} type={mimeType} />
          Seu navegador não suporta reprodução de vídeo.
        </video>
      </div>
    );
  }

  // Renderizar áudio
  if (tipo === 'audio') {
    return (
      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 max-w-[300px]">
        <Play className="h-5 w-5 text-primary" />
        <audio controls className="flex-1">
          <source src={urlStorage} type={mimeType} />
          Seu navegador não suporta reprodução de áudio.
        </audio>
      </div>
    );
  }

  // Renderizar documento ou outro arquivo
  const getIcon = () => {
    if (tipo === 'documento') return FileText;
    return File;
  };

  const Icon = getIcon();

  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3 max-w-[300px] border border-border">
      <div className="flex-shrink-0">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{nomeArquivo}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(tamanhoBytes)}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleDownload}
        className="flex-shrink-0"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};
