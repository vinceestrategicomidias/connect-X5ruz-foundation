import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ThaliAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  processing?: boolean;
}

export const ThaliAvatar = ({ size = "md", className, processing = false }: ThaliAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        // Buscar avatar existente ou gerar novo
        const { data: files } = await supabase.storage
          .from('thali-avatar')
          .list();

        if (files && files.length > 0) {
          // Usar avatar existente
          const { data: publicData } = supabase.storage
            .from('thali-avatar')
            .getPublicUrl(files[0].name);
          setAvatarUrl(publicData.publicUrl);
        } else {
          // Gerar novo avatar
          const { data, error } = await supabase.functions.invoke('generate-thali-avatar');
          if (!error && data?.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar avatar da Thalí:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvatar();
  }, []);

  if (loading || !avatarUrl) {
    // Fallback SVG enquanto carrega
    return (
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center font-display font-bold text-primary-foreground shadow-md",
          sizeClasses[size],
          processing && "animate-breathe",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M2 17L12 22L22 17M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.95"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shadow-md border-2 border-primary/20",
        sizeClasses[size],
        processing && "animate-breathe",
        className
      )}
    >
      <img
        src={avatarUrl}
        alt="Thalí - Assistente Inteligente"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
