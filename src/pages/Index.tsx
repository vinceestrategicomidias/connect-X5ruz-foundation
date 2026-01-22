import { ConnectContainer } from "@/components/ConnectContainer";
import { ConnectNavbar } from "@/components/ConnectNavbar";
import { ConnectColumn1 } from "@/components/ConnectColumn1";
import { ConnectColumn2 } from "@/components/ConnectColumn2";
import { ConnectColumn3 } from "@/components/ConnectColumn3";
import { CallFloatingCard } from "@/components/CallFloatingCard";
import { FloatingButtons } from "@/components/FloatingButtons";
import { ChatInternoButton } from "@/components/ChatInternoButton";

const Index = () => {
  return (
    <ConnectContainer>
      <div className="flex flex-col h-screen">
        {/* Navbar Superior */}
        <ConnectNavbar />

        {/* Layout de 3 Colunas */}
        <div className="flex flex-1 overflow-hidden">
          {/* Coluna 1: Fluxo de Atendimento */}
          <ConnectColumn1 />

          {/* Coluna 2: Área Central de Chat */}
          <ConnectColumn2 />

          {/* Coluna 3: Lista Geral de Pacientes */}
          <ConnectColumn3 />
        </div>
      </div>

      {/* Card Flutuante de Chamada */}
      <CallFloatingCard />

      {/* Botões Flutuantes: Roteiros e IA Thalí */}
      <FloatingButtons />

      {/* Chat Interno da Equipe */}
      <ChatInternoButton />
    </ConnectContainer>
  );
};

export default Index;
