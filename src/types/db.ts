export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      event_log: {
        Row: {
          created_at: string | null
          event_type: string
          id: number
          match_id: string | null
          payload: Json
          player_id: string | null
          tile_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: number
          match_id?: string | null
          payload: Json
          player_id?: string | null
          tile_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: number
          match_id?: string | null
          payload?: Json
          player_id?: string | null
          tile_id?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string | null
          current_tile_id: string | null
          email: string | null
          id: string
          level: number
          max_stamina: number
          primary_code: string | null
          ryo: number
          skill_points: number
          stamina: number
          updated_at: string | null
          username: string
          xp: number
        }
        Insert: {
          created_at?: string | null
          current_tile_id?: string | null
          email?: string | null
          id: string
          level?: number
          max_stamina?: number
          primary_code?: string | null
          ryo?: number
          skill_points?: number
          stamina?: number
          updated_at?: string | null
          username: string
          xp?: number
        }
        Update: {
          created_at?: string | null
          current_tile_id?: string | null
          email?: string | null
          id?: string
          level?: number
          max_stamina?: number
          primary_code?: string | null
          ryo?: number
          skill_points?: number
          stamina?: number
          updated_at?: string | null
          username?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "players_current_tile_id_fkey"
            columns: ["current_tile_id"]
            isOneToOne: false
            referencedRelation: "tiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tiles: {
        Row: {
          created_at: string | null
          discovered_by: string[] | null
          explored: boolean | null
          id: string
          metadata: Json | null
          owner_code: string | null
          q: number
          r: number
          tile_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discovered_by?: string[] | null
          explored?: boolean | null
          id?: string
          metadata?: Json | null
          owner_code?: string | null
          q: number
          r: number
          tile_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discovered_by?: string[] | null
          explored?: boolean | null
          id?: string
          metadata?: Json | null
          owner_code?: string | null
          q?: number
          r?: number
          tile_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_player_profile: {
        Args: { player_username: string; user_email: string; user_id: string }
        Returns: undefined
      }
      execute_action: {
        Args: { p_action_type: string; p_player_id: string; p_tile_id: string }
        Returns: Json
      }
      get_action_details: {
        Args: { p_action_type: string; p_difficulty: string; p_tile_id: string }
        Returns: Json
      }
      update_player_stats: {
        Args: {
          p_hp_change?: number
          p_player_id: string
          p_ryo_change?: number
          p_stamina_change?: number
          p_xp_change?: number
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

