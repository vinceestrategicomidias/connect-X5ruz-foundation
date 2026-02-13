import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export interface MensagemRapida {
  codigo: string;
  titulo: string;
  texto: string;
  setor: string;
  ativa: boolean;
}

export const MENSAGENS_RAPIDAS_INICIAIS: MensagemRapida[] = [
  { codigo: "/pagamento", titulo: "Formas de pagamento", texto: "Temos opções de pagamento via PIX, cartão de crédito e boleto. Me informe qual forma prefere para eu te orientar.", setor: "Venda", ativa: true },
  { codigo: "/aguarde", titulo: "Agradecer por aguardar", texto: "Obrigada por aguardar o retorno 😊 Já vou dar andamento e te respondo em seguida.", setor: "Todos os setores", ativa: true },
  { codigo: "/orcamento", titulo: "Confirmação de envio de orçamento", texto: "Vou preparar o orçamento e já te envio com todos os valores e condições, tudo bem?", setor: "Venda", ativa: true },
  { codigo: "/docs", titulo: "Solicitar documentos", texto: "Para seguirmos, pode me enviar por aqui seus dados/documentos necessários? Assim já adianto seu atendimento.", setor: "Convênios", ativa: true },
  { codigo: "/boasvindas", titulo: "Boas-vindas ao atendimento", texto: "Olá! Seja bem-vindo(a) ao atendimento do Grupo Liruz. Meu nome é [nome], como posso te ajudar hoje?", setor: "Todos os setores", ativa: true },
  { codigo: "/retorno", titulo: "Retorno de contato", texto: "Estou retornando seu contato conforme combinado. Conseguiu verificar as informações que enviamos?", setor: "Todos os setores", ativa: true },
  { codigo: "/agenda", titulo: "Confirmar agendamento", texto: "Seu agendamento está confirmado! Qualquer dúvida ou necessidade de reagendamento, é só me chamar.", setor: "Pré-venda", ativa: true },
  { codigo: "/contrato", titulo: "Envio de contrato", texto: "Estou enviando o contrato para sua análise. Após conferir, me avise para prosseguirmos com a assinatura.", setor: "Venda", ativa: true },
  { codigo: "/encerrar", titulo: "Encerramento cordial", texto: "Foi um prazer te atender! Se precisar de qualquer coisa, estamos à disposição. Tenha um ótimo dia! 😊", setor: "Todos os setores", ativa: true },
  { codigo: "/prazo", titulo: "Informar prazo", texto: "O prazo para retorno/conclusão é de até [X] dias úteis. Fique tranquilo(a) que vou acompanhar de perto.", setor: "Todos os setores", ativa: true },
];

interface MensagensRapidasDropdownProps {
  searchText: string;
  onSelect: (texto: string) => void;
  visible: boolean;
}

export const MensagensRapidasDropdown = ({ searchText, onSelect, visible }: MensagensRapidasDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const filtro = searchText.slice(1).toLowerCase();
  const mensagensFiltradas = MENSAGENS_RAPIDAS_INICIAIS.filter(m => 
    m.ativa && (
      m.codigo.toLowerCase().includes("/" + filtro) ||
      m.titulo.toLowerCase().includes(filtro) ||
      m.texto.toLowerCase().includes(filtro)
    )
  );

  if (!visible || mensagensFiltradas.length === 0) return null;

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden"
    >
      <div className="p-2 border-b flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Mensagens rápidas</span>
        <Badge variant="secondary" className="text-xs">{mensagensFiltradas.length}</Badge>
      </div>
      <ScrollArea className="max-h-[250px]">
        <div className="p-1">
          {mensagensFiltradas.map((msg) => (
            <div
              key={msg.codigo}
              className="p-2.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
              onClick={() => onSelect(msg.texto)}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <code className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{msg.codigo}</code>
                <span className="text-sm font-medium">{msg.titulo}</span>
                <Badge variant="outline" className="text-[10px] ml-auto">{msg.setor}</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{msg.texto}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
