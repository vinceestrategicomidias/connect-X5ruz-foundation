import { useState } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  User, 
  MapPin, 
  File 
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AttachmentMenuProps {
  onFileSelect: (file: File, tipo: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const AttachmentMenu = ({ onFileSelect, children, disabled }: AttachmentMenuProps) => {
  const [open, setOpen] = useState(false);

  const handleFileInput = (accept: string, tipo: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = tipo === "imagem"; // Apenas imagens permitem múltiplas seleções
    
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`Arquivo "${file.name}" excede o limite de 20MB`);
          continue;
        }
        
        onFileSelect(file, tipo);
      }
      
      setOpen(false);
    };
    
    input.click();
  };

  const menuItems = [
    {
      id: "documento",
      icon: FileText,
      label: "Documento",
      description: "PDF, DOC, XLS, etc.",
      accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv",
      color: "text-blue-500",
    },
    {
      id: "imagem",
      icon: ImageIcon,
      label: "Imagem",
      description: "Galeria ou arquivos",
      accept: "image/*",
      color: "text-green-500",
    },
    {
      id: "video",
      icon: Video,
      label: "Vídeo",
      description: "Arquivos de vídeo",
      accept: "video/*",
      color: "text-purple-500",
    },
    {
      id: "contato",
      icon: User,
      label: "Contato",
      description: "Compartilhar contato",
      accept: "",
      color: "text-orange-500",
    },
    {
      id: "localizacao",
      icon: MapPin,
      label: "Localização",
      description: "Compartilhar local",
      accept: "",
      color: "text-red-500",
    },
    {
      id: "outro",
      icon: File,
      label: "Outros arquivos",
      description: "Qualquer tipo",
      accept: "*",
      color: "text-gray-500",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isImplemented = ["documento", "imagem", "video", "outro"].includes(item.id);
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3 px-3"
                disabled={!isImplemented}
                onClick={() => {
                  if (isImplemented) {
                    handleFileInput(item.accept, item.id);
                  } else {
                    toast.info("Funcionalidade em desenvolvimento");
                    setOpen(false);
                  }
                }}
              >
                <Icon className={`h-5 w-5 ${item.color}`} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
