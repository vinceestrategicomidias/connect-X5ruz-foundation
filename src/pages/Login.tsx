import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implementar autenticação Supabase
    console.log("Login:", { email, senha });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A2647]/5 via-background to-[#1D4E89]/5 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo e Branding */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#0A2647] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">GL</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-[#0A2647] uppercase tracking-tight">
              CONNECT
            </h1>
            <p className="text-sm font-normal text-[#1D4E89] uppercase tracking-wider mt-0.5">
              GRUPO LIRUZ
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-[#0A2647] hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0A2647] hover:bg-[#0A2647]/90"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Criar Conta */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <button className="text-[#0A2647] font-medium hover:underline">
              Fazer cadastro
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
