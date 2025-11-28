import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ThaliExpression = "neutral" | "pensativa" | "alertando" | "feliz";

interface ThaliAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  processing?: boolean;
  expression?: ThaliExpression;
}

export const ThaliAvatar = ({ 
  size = "md", 
  className, 
  processing = false,
  expression = "neutral"
}: ThaliAvatarProps) => {
  const [avatarUrls, setAvatarUrls] = useState<Record<ThaliExpression, string | null>>({
    neutral: null,
    pensativa: null,
    alertando: null,
    feliz: null,
  });
  const [loading, setLoading] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  useEffect(() => {
    const loadAvatars = async () => {
      try {
        // Buscar avatares existentes
        const { data: files } = await supabase.storage
          .from('thali-avatar')
          .list();

        if (files && files.length > 0) {
          const urls: Record<string, string> = {};
          
          for (const file of files) {
            const expressionMatch = file.name.match(/thali-avatar-(\w+)-/);
            if (expressionMatch) {
              const expr = expressionMatch[1];
              const { data: publicData } = supabase.storage
                .from('thali-avatar')
                .getPublicUrl(file.name);
              urls[expr] = publicData.publicUrl;
            }
          }

          // Se temos pelo menos o neutral, usar
          if (Object.keys(urls).length > 0) {
            setAvatarUrls(prev => ({ ...prev, ...urls }));
            setLoading(false);
            return;
          }
        }

        // Gerar expressões se não existirem
        console.log("Gerando expressões da Thalí...");
        const { data, error } = await supabase.functions.invoke('generate-thali-expressions');
        
        if (!error && data?.expressions) {
          setAvatarUrls(prev => ({ ...prev, ...data.expressions }));
        }
      } catch (error) {
        console.error("Erro ao carregar avatares da Thalí:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAvatars();
  }, []);

  const currentAvatarUrl = avatarUrls[expression] || avatarUrls.neutral;

  if (loading || !currentAvatarUrl) {
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
        src={currentAvatarUrl}
        alt={`Thalí - ${expression}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};