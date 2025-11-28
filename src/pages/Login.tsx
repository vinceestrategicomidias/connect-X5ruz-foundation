import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("connect@grupoliruz.com");
  const [senha, setSenha] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, allow direct login with demo credentials
      if (email === "connect@grupoliruz.com" && senha === "123456") {
        toast.success("Login realizado com sucesso!");
        navigate("/");
        return;
      }

      // Attempt Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        toast.error("Erro ao fazer login: " + error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Erro inesperado ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-[380px] p-8 space-y-6 shadow-lg border-0 bg-card">
        {/* Logo e Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-[110px] h-[110px] bg-primary rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-4xl">GL</span>
          </div>
          <div className="text-center">
            <h1 className="text-[32px] font-semibold text-foreground uppercase tracking-tight">
              CONNECT
            </h1>
            <p className="text-[13px] font-normal text-muted-foreground uppercase tracking-wider mt-1">
              GRUPO LIRUZ
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-2" onKeyPress={handleKeyPress}>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Demo Credentials Display */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-[13px] font-medium text-foreground">
                Credenciais de apresentação:
              </p>
              <p className="text-[13px] text-muted-foreground">
                E-mail: <span className="font-mono text-foreground">connect@grupoliruz.com</span>
              </p>
              <p className="text-[13px] text-muted-foreground">
                Senha: <span className="font-mono text-foreground">123456</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
