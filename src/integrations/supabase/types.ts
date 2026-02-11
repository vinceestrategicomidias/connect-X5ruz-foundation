export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      anexos_mensagens: {
        Row: {
          created_at: string | null
          duracao_segundos: number | null
          id: string
          mensagem_id: string | null
          metadados: Json | null
          mime_type: string | null
          nome_arquivo: string
          tamanho_bytes: number | null
          tipo: string
          transcricao: string | null
          url_storage: string
        }
        Insert: {
          created_at?: string | null
          duracao_segundos?: number | null
          id?: string
          mensagem_id?: string | null
          metadados?: Json | null
          mime_type?: string | null
          nome_arquivo: string
          tamanho_bytes?: number | null
          tipo: string
          transcricao?: string | null
          url_storage: string
        }
        Update: {
          created_at?: string | null
          duracao_segundos?: number | null
          id?: string
          mensagem_id?: string | null
          metadados?: Json | null
          mime_type?: string | null
          nome_arquivo?: string
          tamanho_bytes?: number | null
          tipo?: string
          transcricao?: string | null
          url_storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexos_mensagens_mensagem_id_fkey"
            columns: ["mensagem_id"]
            isOneToOne: false
            referencedRelation: "mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      api_config: {
        Row: {
          api_key: string
          created_at: string | null
          empresa_id: string | null
          id: string
          integracoes_externas: Json | null
          limites_sla: Json | null
          updated_at: string | null
          webhooks: Json | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          integracoes_externas?: Json | null
          limites_sla?: Json | null
          updated_at?: string | null
          webhooks?: Json | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          integracoes_externas?: Json | null
          limites_sla?: Json | null
          updated_at?: string | null
          webhooks?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "api_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      api_logs: {
        Row: {
          api_key_id: string | null
          created_at: string | null
          endpoint: string
          id: string
          ip_origem: string | null
          metodo: string
          payload_resumido: Json | null
          status_code: number | null
          tempo_resposta_ms: number | null
          user_agent: string | null
        }
        Insert: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint: string
          id?: string
          ip_origem?: string | null
          metodo: string
          payload_resumido?: Json | null
          status_code?: number | null
          tempo_resposta_ms?: number | null
          user_agent?: string | null
        }
        Update: {
          api_key_id?: string | null
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_origem?: string | null
          metodo?: string
          payload_resumido?: Json | null
          status_code?: number | null
          tempo_resposta_ms?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_logs_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_config"
            referencedColumns: ["id"]
          },
        ]
      }
      api_rate_limits: {
        Row: {
          api_key_id: string | null
          contador: number | null
          created_at: string | null
          id: string
          minuto: string
        }
        Insert: {
          api_key_id?: string | null
          contador?: number | null
          created_at?: string | null
          id?: string
          minuto: string
        }
        Update: {
          api_key_id?: string | null
          contador?: number | null
          created_at?: string | null
          id?: string
          minuto?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_limits_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_config"
            referencedColumns: ["id"]
          },
        ]
      }
      atendentes: {
        Row: {
          ativo: boolean | null
          avatar: string | null
          cargo: Database["public"]["Enums"]["cargo_tipo"] | null
          created_at: string | null
          email: string | null
          id: string
          nome: string
          perfil_id: string | null
          senha: string | null
          setor_id: string | null
          unidade_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          avatar?: string | null
          cargo?: Database["public"]["Enums"]["cargo_tipo"] | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome: string
          perfil_id?: string | null
          senha?: string | null
          setor_id?: string | null
          unidade_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          avatar?: string | null
          cargo?: Database["public"]["Enums"]["cargo_tipo"] | null
          created_at?: string | null
          email?: string | null
          id?: string
          nome?: string
          perfil_id?: string | null
          senha?: string | null
          setor_id?: string | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "atendentes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis_de_acesso"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendentes_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendentes_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      chamadas: {
        Row: {
          atendente_id: string
          created_at: string | null
          duracao: number | null
          horario_fim: string | null
          horario_inicio: string | null
          id: string
          numero_discado: string
          observacoes: string | null
          paciente_id: string | null
          setor_origem: string | null
          status: string
          tipo: string
        }
        Insert: {
          atendente_id: string
          created_at?: string | null
          duracao?: number | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          numero_discado: string
          observacoes?: string | null
          paciente_id?: string | null
          setor_origem?: string | null
          status?: string
          tipo?: string
        }
        Update: {
          atendente_id?: string
          created_at?: string | null
          duracao?: number | null
          horario_fim?: string | null
          horario_inicio?: string | null
          id?: string
          numero_discado?: string
          observacoes?: string | null
          paciente_id?: string | null
          setor_origem?: string | null
          status?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "chamadas_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chamadas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chamadas_setor_origem_fkey"
            columns: ["setor_origem"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_cases: {
        Row: {
          conversa_id: string | null
          created_at: string | null
          empresa_id: string | null
          id: string
          loss_reason_id: string | null
          next_followup_at: string | null
          provider_id: string | null
          service_type_id: string | null
          stage: string
          updated_at: string | null
          value_closed: number | null
          value_estimated: number | null
        }
        Insert: {
          conversa_id?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          loss_reason_id?: string | null
          next_followup_at?: string | null
          provider_id?: string | null
          service_type_id?: string | null
          stage?: string
          updated_at?: string | null
          value_closed?: number | null
          value_estimated?: number | null
        }
        Update: {
          conversa_id?: string | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          loss_reason_id?: string | null
          next_followup_at?: string | null
          provider_id?: string | null
          service_type_id?: string | null
          stage?: string
          updated_at?: string | null
          value_closed?: number | null
          value_estimated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commercial_cases_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_cases_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_cases_loss_reason_id_fkey"
            columns: ["loss_reason_id"]
            isOneToOne: false
            referencedRelation: "loss_reasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_cases_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_cases_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_events: {
        Row: {
          commercial_case_id: string
          created_at: string | null
          created_by: string | null
          event_type: string
          from_value: string | null
          id: string
          to_value: string | null
        }
        Insert: {
          commercial_case_id: string
          created_at?: string | null
          created_by?: string | null
          event_type: string
          from_value?: string | null
          id?: string
          to_value?: string | null
        }
        Update: {
          commercial_case_id?: string
          created_at?: string | null
          created_by?: string | null
          event_type?: string
          from_value?: string | null
          id?: string
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commercial_events_commercial_case_id_fkey"
            columns: ["commercial_case_id"]
            isOneToOne: false
            referencedRelation: "commercial_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commercial_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      conversas: {
        Row: {
          atendente_id: string | null
          created_at: string | null
          id: string
          paciente_id: string
          updated_at: string | null
        }
        Insert: {
          atendente_id?: string | null
          created_at?: string | null
          id?: string
          paciente_id: string
          updated_at?: string | null
        }
        Update: {
          atendente_id?: string | null
          created_at?: string | null
          id?: string
          paciente_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversas_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string | null
          created_at: string | null
          endereco: string | null
          id: string
          logo_url: string | null
          nome: string
          responsavel: string | null
          updated_at: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          responsavel?: string | null
          updated_at?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          endereco?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          responsavel?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      figurinhas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          ordem: number | null
          pacote_id: string | null
          tags: string[] | null
          url_imagem: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number | null
          pacote_id?: string | null
          tags?: string[] | null
          url_imagem: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          pacote_id?: string | null
          tags?: string[] | null
          url_imagem?: string
        }
        Relationships: [
          {
            foreignKeyName: "figurinhas_pacote_id_fkey"
            columns: ["pacote_id"]
            isOneToOne: false
            referencedRelation: "pacotes_figurinhas"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_alertas: {
        Row: {
          acao_recomendada: string | null
          atendido: boolean | null
          atendido_em: string | null
          atendido_por: string | null
          created_at: string | null
          dados_contexto: Json | null
          descricao: string
          destinatarios: string[] | null
          id: string
          severidade: string | null
          tipo: string
          titulo: string
        }
        Insert: {
          acao_recomendada?: string | null
          atendido?: boolean | null
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          dados_contexto?: Json | null
          descricao: string
          destinatarios?: string[] | null
          id?: string
          severidade?: string | null
          tipo: string
          titulo: string
        }
        Update: {
          acao_recomendada?: string | null
          atendido?: boolean | null
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          dados_contexto?: Json | null
          descricao?: string
          destinatarios?: string[] | null
          id?: string
          severidade?: string | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "ia_alertas_atendido_por_fkey"
            columns: ["atendido_por"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_analise_intencao: {
        Row: {
          confianca: number | null
          conversa_id: string | null
          created_at: string | null
          dados_extraidos: Json | null
          id: string
          intencao_principal: string
          intencoes_secundarias: Json | null
          nivel_urgencia: string | null
          paciente_id: string | null
          texto_analisado: string
          tipo_procedimento: string | null
        }
        Insert: {
          confianca?: number | null
          conversa_id?: string | null
          created_at?: string | null
          dados_extraidos?: Json | null
          id?: string
          intencao_principal: string
          intencoes_secundarias?: Json | null
          nivel_urgencia?: string | null
          paciente_id?: string | null
          texto_analisado: string
          tipo_procedimento?: string | null
        }
        Update: {
          confianca?: number | null
          conversa_id?: string | null
          created_at?: string | null
          dados_extraidos?: Json | null
          id?: string
          intencao_principal?: string
          intencoes_secundarias?: Json | null
          nivel_urgencia?: string | null
          paciente_id?: string | null
          texto_analisado?: string
          tipo_procedimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_analise_intencao_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_analise_intencao_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_auditoria: {
        Row: {
          acao_executada: string | null
          created_at: string | null
          dados_entrada: Json | null
          dados_saida: Json | null
          executado_automaticamente: boolean | null
          id: string
          recomendacao: string | null
          resumo_analise: string | null
          setor_id: string | null
          tipo_decisao: string
          unidade_id: string | null
        }
        Insert: {
          acao_executada?: string | null
          created_at?: string | null
          dados_entrada?: Json | null
          dados_saida?: Json | null
          executado_automaticamente?: boolean | null
          id?: string
          recomendacao?: string | null
          resumo_analise?: string | null
          setor_id?: string | null
          tipo_decisao: string
          unidade_id?: string | null
        }
        Update: {
          acao_executada?: string | null
          created_at?: string | null
          dados_entrada?: Json | null
          dados_saida?: Json | null
          executado_automaticamente?: boolean | null
          id?: string
          recomendacao?: string | null
          resumo_analise?: string | null
          setor_id?: string | null
          tipo_decisao?: string
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_auditoria_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_auditoria_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_classificacao_picos: {
        Row: {
          classificacao: string | null
          created_at: string | null
          data: string
          hora_fim: string
          hora_inicio: string
          id: string
          quantidade_atendimentos: number | null
          quantidade_mensagens: number | null
          setor_id: string | null
          tma_medio: number | null
          tme_medio: number | null
          unidade_id: string | null
        }
        Insert: {
          classificacao?: string | null
          created_at?: string | null
          data: string
          hora_fim: string
          hora_inicio: string
          id?: string
          quantidade_atendimentos?: number | null
          quantidade_mensagens?: number | null
          setor_id?: string | null
          tma_medio?: number | null
          tme_medio?: number | null
          unidade_id?: string | null
        }
        Update: {
          classificacao?: string | null
          created_at?: string | null
          data?: string
          hora_fim?: string
          hora_inicio?: string
          id?: string
          quantidade_atendimentos?: number | null
          quantidade_mensagens?: number | null
          setor_id?: string | null
          tma_medio?: number | null
          tme_medio?: number | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_classificacao_picos_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_classificacao_picos_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_config: {
        Row: {
          alertas_inteligentes_ativos: boolean | null
          analise_intencao_ativa: boolean | null
          created_at: string | null
          empresa_id: string | null
          feedback_automatico_ativo: boolean | null
          ia_ativa: boolean | null
          id: string
          limite_fila_alta: number | null
          limite_nps_baixo: number | null
          limite_tma_minutos: number | null
          nivel_atuacao: string | null
          pre_atendimento_ativo: boolean | null
          preditiva_ativa: boolean | null
          sensibilidade_alertas: string | null
          setor_id: string | null
          sugestao_respostas_ativa: boolean | null
          unidade_id: string | null
          updated_at: string | null
        }
        Insert: {
          alertas_inteligentes_ativos?: boolean | null
          analise_intencao_ativa?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          feedback_automatico_ativo?: boolean | null
          ia_ativa?: boolean | null
          id?: string
          limite_fila_alta?: number | null
          limite_nps_baixo?: number | null
          limite_tma_minutos?: number | null
          nivel_atuacao?: string | null
          pre_atendimento_ativo?: boolean | null
          preditiva_ativa?: boolean | null
          sensibilidade_alertas?: string | null
          setor_id?: string | null
          sugestao_respostas_ativa?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Update: {
          alertas_inteligentes_ativos?: boolean | null
          analise_intencao_ativa?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          feedback_automatico_ativo?: boolean | null
          ia_ativa?: boolean | null
          id?: string
          limite_fila_alta?: number | null
          limite_nps_baixo?: number | null
          limite_tma_minutos?: number | null
          nivel_atuacao?: string | null
          pre_atendimento_ativo?: boolean | null
          preditiva_ativa?: boolean | null
          sensibilidade_alertas?: string | null
          setor_id?: string | null
          sugestao_respostas_ativa?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_config_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_config_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_config_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_energia_equipe: {
        Row: {
          created_at: string | null
          data: string
          fatores: Json | null
          hora: string
          id: string
          metricas: Json | null
          nivel_energia: string | null
          setor_id: string | null
          unidade_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          fatores?: Json | null
          hora: string
          id?: string
          metricas?: Json | null
          nivel_energia?: string | null
          setor_id?: string | null
          unidade_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          fatores?: Json | null
          hora?: string
          id?: string
          metricas?: Json | null
          nivel_energia?: string | null
          setor_id?: string | null
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_energia_equipe_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_energia_equipe_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_feedbacks: {
        Row: {
          aprovado: boolean | null
          aprovado_por: string | null
          atendente_id: string | null
          created_at: string | null
          enviado: boolean | null
          enviado_em: string | null
          id: string
          justificativa: string
          mensagem_sugerida: string | null
          metricas_relacionadas: Json | null
          tipo: string | null
          titulo: string
        }
        Insert: {
          aprovado?: boolean | null
          aprovado_por?: string | null
          atendente_id?: string | null
          created_at?: string | null
          enviado?: boolean | null
          enviado_em?: string | null
          id?: string
          justificativa: string
          mensagem_sugerida?: string | null
          metricas_relacionadas?: Json | null
          tipo?: string | null
          titulo: string
        }
        Update: {
          aprovado?: boolean | null
          aprovado_por?: string | null
          atendente_id?: string | null
          created_at?: string | null
          enviado?: boolean | null
          enviado_em?: string | null
          id?: string
          justificativa?: string
          mensagem_sugerida?: string | null
          metricas_relacionadas?: Json | null
          tipo?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "ia_feedbacks_aprovado_por_fkey"
            columns: ["aprovado_por"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ia_feedbacks_atendente_id_fkey"
            columns: ["atendente_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      ia_preditiva: {
        Row: {
          acuracia_anterior: number | null
          created_at: string | null
          data_previsao: string
          horarios_pico: Json | null
          id: string
          recomendacoes: Json | null
          risco_sla: string | null
          setores_alta_demanda: Json | null
          unidade_id: string | null
          volume_esperado: number | null
        }
        Insert: {
          acuracia_anterior?: number | null
          created_at?: string | null
          data_previsao: string
          horarios_pico?: Json | null
          id?: string
          recomendacoes?: Json | null
          risco_sla?: string | null
          setores_alta_demanda?: Json | null
          unidade_id?: string | null
          volume_esperado?: number | null
        }
        Update: {
          acuracia_anterior?: number | null
          created_at?: string | null
          data_previsao?: string
          horarios_pico?: Json | null
          id?: string
          recomendacoes?: Json | null
          risco_sla?: string | null
          setores_alta_demanda?: Json | null
          unidade_id?: string | null
          volume_esperado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ia_preditiva_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      loss_reasons: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresa_id: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loss_reasons_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          autor: string
          conversa_id: string
          created_at: string | null
          figurinha_id: string | null
          horario: string
          id: string
          texto: string
          tipo: string
          tipo_conteudo: string | null
        }
        Insert: {
          autor: string
          conversa_id: string
          created_at?: string | null
          figurinha_id?: string | null
          horario: string
          id?: string
          texto: string
          tipo: string
          tipo_conteudo?: string | null
        }
        Update: {
          autor?: string
          conversa_id?: string
          created_at?: string | null
          figurinha_id?: string | null
          horario?: string
          id?: string
          texto?: string
          tipo?: string
          tipo_conteudo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_figurinha_id_fkey"
            columns: ["figurinha_id"]
            isOneToOne: false
            referencedRelation: "figurinhas"
            referencedColumns: ["id"]
          },
        ]
      }
      mensageria_config: {
        Row: {
          assistente_config: Json | null
          created_at: string | null
          fluxos_automatizados: Json | null
          ia_ativa: boolean | null
          id: string
          respostas_automaticas: Json | null
          robo_ativo: boolean | null
          unidade_id: string | null
          updated_at: string | null
        }
        Insert: {
          assistente_config?: Json | null
          created_at?: string | null
          fluxos_automatizados?: Json | null
          ia_ativa?: boolean | null
          id?: string
          respostas_automaticas?: Json | null
          robo_ativo?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assistente_config?: Json | null
          created_at?: string | null
          fluxos_automatizados?: Json | null
          ia_ativa?: boolean | null
          id?: string
          respostas_automaticas?: Json | null
          robo_ativo?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mensageria_config_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          acao: string | null
          created_at: string | null
          data_hora: string
          id: string
          lida: boolean
          mensagem: string
          referencia_id: string | null
          tipo: string
          titulo: string
          usuario_destino_id: string
        }
        Insert: {
          acao?: string | null
          created_at?: string | null
          data_hora?: string
          id?: string
          lida?: boolean
          mensagem: string
          referencia_id?: string | null
          tipo: string
          titulo: string
          usuario_destino_id: string
        }
        Update: {
          acao?: string | null
          created_at?: string | null
          data_hora?: string
          id?: string
          lida?: boolean
          mensagem?: string
          referencia_id?: string | null
          tipo?: string
          titulo?: string
          usuario_destino_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_destino_id_fkey"
            columns: ["usuario_destino_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          atendente_responsavel: string | null
          avatar: string | null
          created_at: string | null
          id: string
          nome: string
          setor_id: string | null
          status: string
          telefone: string
          tempo_na_fila: number | null
          ultima_mensagem: string | null
          updated_at: string | null
        }
        Insert: {
          atendente_responsavel?: string | null
          avatar?: string | null
          created_at?: string | null
          id?: string
          nome: string
          setor_id?: string | null
          status: string
          telefone: string
          tempo_na_fila?: number | null
          ultima_mensagem?: string | null
          updated_at?: string | null
        }
        Update: {
          atendente_responsavel?: string | null
          avatar?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          setor_id?: string | null
          status?: string
          telefone?: string
          tempo_na_fila?: number | null
          ultima_mensagem?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_atendente_responsavel_fkey"
            columns: ["atendente_responsavel"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pacientes_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      pacotes_figurinhas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      perfil_validacoes: {
        Row: {
          campos_alterados: Json
          coordenador_responsavel: string | null
          created_at: string | null
          data_solicitacao: string | null
          data_validacao: string | null
          id: string
          observacao: string | null
          status: string
          updated_at: string | null
          usuario_id: string
          valores_novos: Json
        }
        Insert: {
          campos_alterados: Json
          coordenador_responsavel?: string | null
          created_at?: string | null
          data_solicitacao?: string | null
          data_validacao?: string | null
          id?: string
          observacao?: string | null
          status?: string
          updated_at?: string | null
          usuario_id: string
          valores_novos: Json
        }
        Update: {
          campos_alterados?: Json
          coordenador_responsavel?: string | null
          created_at?: string | null
          data_solicitacao?: string | null
          data_validacao?: string | null
          id?: string
          observacao?: string | null
          status?: string
          updated_at?: string | null
          usuario_id?: string
          valores_novos?: Json
        }
        Relationships: [
          {
            foreignKeyName: "perfil_validacoes_coordenador_responsavel_fkey"
            columns: ["coordenador_responsavel"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfil_validacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "atendentes"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_de_acesso: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          permissoes: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          permissoes?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          permissoes?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresa_id: string | null
          especialidade: string | null
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          especialidade?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          especialidade?: string | null
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "providers_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresa_id: string | null
          id: string
          nome: string
          ordem: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          ordem?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_types_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          ativo: boolean | null
          cor: string | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          recebe_ligacoes: boolean | null
          recebe_mensagens: boolean | null
          unidade_id: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          recebe_ligacoes?: boolean | null
          recebe_mensagens?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cor?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          recebe_ligacoes?: boolean | null
          recebe_mensagens?: boolean | null
          unidade_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "setores_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          ativo: boolean | null
          codigo_interno: string | null
          created_at: string | null
          empresa_id: string | null
          endereco: string | null
          fuso_horario: string | null
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo_interno?: string | null
          created_at?: string | null
          empresa_id?: string | null
          endereco?: string | null
          fuso_horario?: string | null
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo_interno?: string | null
          created_at?: string | null
          empresa_id?: string | null
          endereco?: string | null
          fuso_horario?: string | null
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unidades_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      ura_config: {
        Row: {
          ativo: boolean | null
          audio_url: string | null
          created_at: string | null
          horario_funcionamento: Json | null
          id: string
          mensagem_boas_vindas: string | null
          mensagem_espera: string | null
          mensagem_fora_expediente: string | null
          mensagem_lotacao: string | null
          opcoes: Json | null
          unidade_id: string | null
          updated_at: string | null
          voz_tipo: string | null
        }
        Insert: {
          ativo?: boolean | null
          audio_url?: string | null
          created_at?: string | null
          horario_funcionamento?: Json | null
          id?: string
          mensagem_boas_vindas?: string | null
          mensagem_espera?: string | null
          mensagem_fora_expediente?: string | null
          mensagem_lotacao?: string | null
          opcoes?: Json | null
          unidade_id?: string | null
          updated_at?: string | null
          voz_tipo?: string | null
        }
        Update: {
          ativo?: boolean | null
          audio_url?: string | null
          created_at?: string | null
          horario_funcionamento?: Json | null
          id?: string
          mensagem_boas_vindas?: string | null
          mensagem_espera?: string | null
          mensagem_fora_expediente?: string | null
          mensagem_lotacao?: string | null
          opcoes?: Json | null
          unidade_id?: string | null
          updated_at?: string | null
          voz_tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ura_config_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          empresa_id: string | null
          evento: string
          id: string
          secret: string | null
          tentativas_falhas: number | null
          ultima_tentativa: string | null
          updated_at: string | null
          url_destino: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          evento: string
          id?: string
          secret?: string | null
          tentativas_falhas?: number | null
          ultima_tentativa?: string | null
          updated_at?: string | null
          url_destino: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          empresa_id?: string | null
          evento?: string
          id?: string
          secret?: string | null
          tentativas_falhas?: number | null
          ultima_tentativa?: string | null
          updated_at?: string | null
          url_destino?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_api_logs: { Args: never; Returns: undefined }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "atendente"
        | "coordenacao"
        | "gestor"
        | "auditor"
        | "supervisor"
      cargo_tipo: "atendente" | "coordenacao" | "gestor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["atendente", "coordenacao", "gestor", "auditor", "supervisor"],
      cargo_tipo: ["atendente", "coordenacao", "gestor"],
    },
  },
} as const
