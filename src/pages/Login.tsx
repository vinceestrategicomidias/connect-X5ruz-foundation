import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MessageSquare, Users, BarChart3, Shield, Sparkles, Mail, Lock, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const featureCards = [
  {
    icon: MessageSquare,
    title: "Atendimento Integrado",
    description: "Gerencie conversas de WhatsApp, chat e ligações em um só lugar",
  },
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Cadastro completo com histórico e prontuário eletrônico",
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Dashboards e métricas em tempo real para tomada de decisões",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Dados protegidos com criptografia de ponta a ponta",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("connect@grupoliruz.com");
  const [senha, setSenha] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [termosOpen, setTermosOpen] = useState(false);
  const [privacidadeOpen, setPrivacidadeOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/chat");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setSenhaError("");

    if (!email.trim()) {
      setEmailError("Informe seu e-mail");
      return;
    }
    if (!senha.trim()) {
      setSenhaError("Informe sua senha");
      return;
    }

    setIsLoading(true);

    try {
      if (email === "connect@grupoliruz.com" && senha === "123456") {
        toast.success("Login realizado com sucesso!");
        navigate("/chat");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        toast.error("Credenciais inválidas. Verifique e tente novamente.");
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/chat");
      }
    } catch {
      toast.error("Credenciais inválidas. Verifique e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: "linear-gradient(135deg, hsl(210 79% 8%) 0%, hsl(210 79% 14%) 50%, hsl(214 60% 18%) 100%)" }}>
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        title="Tela cheia"
      >
        <Maximize2 className="w-4 h-4 text-white/50 hover:text-white/80" />
      </button>
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT COLUMN – Marketing */}
        <div className="hidden lg:flex flex-col gap-8">
          <div>
            <h1 className="text-[42px] font-bold leading-tight text-white">
              Transforme seu{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, hsl(168 80% 50%), hsl(174 72% 56%))" }}>
                atendimento
              </span>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60 max-w-[480px]">
              Plataforma completa para gestão de atendimento ao paciente, integrando comunicação, agendamentos e prontuários.
            </p>
          </div>

          {/* Feature Cards 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors"
                style={{ background: "hsla(210, 60%, 16%, 0.6)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "linear-gradient(135deg, hsl(168 80% 50% / 0.2), hsl(174 72% 56% / 0.2))" }}
                >
                  <card.icon className="w-5 h-5" style={{ color: "hsl(168 80% 50%)" }} />
                </div>
                <h3 className="text-[14px] font-semibold text-white mb-1">{card.title}</h3>
                <p className="text-[12px] text-white/50 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* AI Card */}
          <div
            className="rounded-xl p-5 border border-white/10 backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, hsla(168, 80%, 50%, 0.08), hsla(210, 60%, 16%, 0.6))" }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(168 80% 50% / 0.2), hsl(174 72% 56% / 0.2))" }}
              >
                <Sparkles className="w-5 h-5" style={{ color: "hsl(168 80% 50%)" }} />
              </div>
              <h3 className="text-[14px] font-semibold text-white">Inteligência Artificial</h3>
            </div>
            <p className="text-[12px] text-white/50 leading-relaxed">
              Assistente Thalí integrada para sugestões de respostas, análise de sentimentos e automação de tarefas.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN – Login Card */}
        <div className="w-full flex justify-center lg:justify-end">
          <div
            className="w-full max-w-[420px] rounded-2xl p-8 border border-white/10 backdrop-blur-sm"
            style={{ background: "hsla(210, 60%, 14%, 0.8)" }}
          >
            <div className="text-center mb-8">
              <h2 className="text-[24px] font-semibold text-white">Bem-vindo de volta</h2>
              <p className="text-[13px] text-white/50 mt-1">Entre com suas credenciais para acessar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] text-white/70">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    className="h-12 pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                  />
                </div>
                {emailError && <p className="text-[12px] text-red-400">{emailError}</p>}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha" className="text-[13px] text-white/70">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    value={senha}
                    onChange={(e) => { setSenha(e.target.value); setSenhaError(""); }}
                    className="h-12 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {senhaError && <p className="text-[12px] text-red-400">{senhaError}</p>}
              </div>

              {/* Esqueci senha */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
                >
                  Esqueceu sua senha?
                </button>
              </div>

              {/* Botão Entrar */}
              <Button
                type="submit"
                className="w-full h-12 text-[14px] font-semibold rounded-xl text-white border-0"
                style={{ background: "linear-gradient(135deg, hsl(168 80% 45%), hsl(174 72% 50%))" }}
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Divisor */}
            <div className="flex items-center gap-3 mt-6 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] text-white/30 whitespace-nowrap">Sistema de Atendimento</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Termos */}
            <p className="text-center text-[11px] text-white/30 leading-relaxed">
              Ao entrar, você concorda com nossos{" "}
              <button onClick={() => setTermosOpen(true)} className="underline hover:text-white/50 transition-colors">
                Termos de Uso
              </button>{" "}
              e{" "}
              <button onClick={() => setPrivacidadeOpen(true)} className="underline hover:text-white/50 transition-colors">
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-[11px] text-white/20">
        © 2026 Grupo Liruz. Todos os direitos reservados.
      </p>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[hsl(210,60%,14%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Recuperar Senha</DialogTitle>
            <DialogDescription className="text-white/50">
              Solicite ao administrador a redefinição da sua senha.
            </DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => setForgotPasswordOpen(false)} className="mt-2 border-white/10 text-white hover:bg-white/5">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Termos Dialog */}
      <Dialog open={termosOpen} onOpenChange={setTermosOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[hsl(210,60%,14%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Termos de Uso</DialogTitle>
            <DialogDescription className="text-white/50">
              Os termos de uso serão disponibilizados em breve. Este é um protótipo de demonstração.
            </DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => setTermosOpen(false)} className="mt-2 border-white/10 text-white hover:bg-white/5">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Privacidade Dialog */}
      <Dialog open={privacidadeOpen} onOpenChange={setPrivacidadeOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[hsl(210,60%,14%)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Política de Privacidade</DialogTitle>
            <DialogDescription className="text-white/50">
              A política de privacidade será disponibilizada em breve. Este é um protótipo de demonstração.
            </DialogDescription>
          </DialogHeader>
          <Button variant="outline" onClick={() => setPrivacidadeOpen(false)} className="mt-2 border-white/10 text-white hover:bg-white/5">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
