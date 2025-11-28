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
      mensagens: {
        Row: {
          autor: string
          conversa_id: string
          created_at: string | null
          horario: string
          id: string
          texto: string
          tipo: string
        }
        Insert: {
          autor: string
          conversa_id: string
          created_at?: string | null
          horario: string
          id?: string
          texto: string
          tipo: string
        }
        Update: {
          autor?: string
          conversa_id?: string
          created_at?: string | null
          horario?: string
          id?: string
          texto?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_conversa_id_fkey"
            columns: ["conversa_id"]
            isOneToOne: false
            referencedRelation: "conversas"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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
