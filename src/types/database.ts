// Tipos do schema Supabase. Gerados manualmente a partir de supabase/migrations/*.sql.
// Quando o projeto Supabase real existir, prefira regenerar com:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type OrgRole = "owner" | "admin" | "qa_lead" | "qa" | "dev" | "viewer";
export type TestCaseType = "manual" | "automated";
export type TestCaseStatus = "active" | "draft" | "deprecated";
export type Priority = "low" | "medium" | "high" | "critical";
export type DefectPriority = "low" | "medium" | "high" | "urgent";
export type TestRunStatus = "in_progress" | "completed";
export type TestRunTrigger = "manual" | "ci_import";
export type ResultStatus =
  | "pending"
  | "passed"
  | "failed"
  | "blocked"
  | "skipped"
  | "flaky";
export type DefectStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
  | "wontfix";
export type TestFramework = "playwright" | "puppeteer" | "junit" | "other";

export interface TestStep {
  action: string;
  expected?: string;
}

export interface EvidenceItem {
  url: string;
  label?: string;
}

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: OrgRole;
          invited_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: OrgRole;
          invited_email?: string | null;
        };
        Update: {
          role?: OrgRole;
        };
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          key: string;
          description: string | null;
          repo_url: string | null;
          gitlab_base_url: string | null;
          gitlab_project_id: string | null;
          gitlab_token_encrypted: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          key: string;
          description?: string | null;
          repo_url?: string | null;
          gitlab_base_url?: string | null;
          gitlab_project_id?: string | null;
          gitlab_token_encrypted?: string | null;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          key?: string;
          description?: string | null;
          repo_url?: string | null;
          gitlab_base_url?: string | null;
          gitlab_project_id?: string | null;
          gitlab_token_encrypted?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: OrgRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: OrgRole;
        };
        Update: {
          role?: OrgRole;
        };
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      components: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "components_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      test_cases: {
        Row: {
          id: string;
          project_id: string;
          component_id: string | null;
          title: string;
          preconditions: string | null;
          steps: TestStep[];
          expected_result: string | null;
          type: TestCaseType;
          priority: Priority;
          status: TestCaseStatus;
          tags: string[];
          external_ref: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          component_id?: string | null;
          title: string;
          preconditions?: string | null;
          steps?: TestStep[];
          expected_result?: string | null;
          type?: TestCaseType;
          priority?: Priority;
          status?: TestCaseStatus;
          tags?: string[];
          external_ref?: string | null;
          created_by?: string | null;
        };
        Update: {
          component_id?: string | null;
          title?: string;
          preconditions?: string | null;
          steps?: TestStep[];
          expected_result?: string | null;
          type?: TestCaseType;
          priority?: Priority;
          status?: TestCaseStatus;
          tags?: string[];
          external_ref?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_cases_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_cases_component_id_fkey";
            columns: ["component_id"];
            isOneToOne: false;
            referencedRelation: "components";
            referencedColumns: ["id"];
          },
        ];
      };
      test_plans: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          description: string | null;
          cycle_name: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          description?: string | null;
          cycle_name?: string | null;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          cycle_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_plans_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      test_plan_cases: {
        Row: {
          id: string;
          test_plan_id: string;
          test_case_id: string;
          position: number;
        };
        Insert: {
          id?: string;
          test_plan_id: string;
          test_case_id: string;
          position?: number;
        };
        Update: {
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "test_plan_cases_test_plan_id_fkey";
            columns: ["test_plan_id"];
            isOneToOne: false;
            referencedRelation: "test_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_plan_cases_test_case_id_fkey";
            columns: ["test_case_id"];
            isOneToOne: false;
            referencedRelation: "test_cases";
            referencedColumns: ["id"];
          },
        ];
      };
      test_runs: {
        Row: {
          id: string;
          project_id: string;
          test_plan_id: string | null;
          name: string;
          environment: string | null;
          triggered_by: TestRunTrigger;
          status: TestRunStatus;
          started_at: string;
          finished_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          test_plan_id?: string | null;
          name: string;
          environment?: string | null;
          triggered_by?: TestRunTrigger;
          status?: TestRunStatus;
          started_at?: string;
          finished_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          name?: string;
          environment?: string | null;
          status?: TestRunStatus;
          finished_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_runs_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_runs_test_plan_id_fkey";
            columns: ["test_plan_id"];
            isOneToOne: false;
            referencedRelation: "test_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      test_run_results: {
        Row: {
          id: string;
          test_run_id: string;
          test_case_id: string | null;
          external_test_name: string | null;
          status: ResultStatus;
          duration_ms: number | null;
          evidence: EvidenceItem[];
          notes: string | null;
          executed_by: string | null;
          executed_at: string | null;
        };
        Insert: {
          id?: string;
          test_run_id: string;
          test_case_id?: string | null;
          external_test_name?: string | null;
          status?: ResultStatus;
          duration_ms?: number | null;
          evidence?: EvidenceItem[];
          notes?: string | null;
          executed_by?: string | null;
          executed_at?: string | null;
        };
        Update: {
          status?: ResultStatus;
          duration_ms?: number | null;
          evidence?: EvidenceItem[];
          notes?: string | null;
          executed_by?: string | null;
          executed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_run_results_test_run_id_fkey";
            columns: ["test_run_id"];
            isOneToOne: false;
            referencedRelation: "test_runs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_run_results_test_case_id_fkey";
            columns: ["test_case_id"];
            isOneToOne: false;
            referencedRelation: "test_cases";
            referencedColumns: ["id"];
          },
        ];
      };
      defects: {
        Row: {
          id: string;
          project_id: string;
          test_run_result_id: string | null;
          title: string;
          description: string | null;
          severity: Priority;
          priority: DefectPriority;
          status: DefectStatus;
          gitlab_issue_iid: string | null;
          gitlab_issue_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          test_run_result_id?: string | null;
          title: string;
          description?: string | null;
          severity?: Priority;
          priority?: DefectPriority;
          status?: DefectStatus;
          gitlab_issue_iid?: string | null;
          gitlab_issue_url?: string | null;
          created_by?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          severity?: Priority;
          priority?: DefectPriority;
          status?: DefectStatus;
          gitlab_issue_iid?: string | null;
          gitlab_issue_url?: string | null;
          resolved_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "defects_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "defects_test_run_result_id_fkey";
            columns: ["test_run_result_id"];
            isOneToOne: false;
            referencedRelation: "test_run_results";
            referencedColumns: ["id"];
          },
        ];
      };
      automated_test_catalog: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          suite: string | null;
          framework: TestFramework | null;
          file_path: string | null;
          last_status: ResultStatus | null;
          failure_streak: number;
          flaky_score: number;
          last_run_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          suite?: string | null;
          framework?: TestFramework | null;
          file_path?: string | null;
          last_status?: ResultStatus | null;
          failure_streak?: number;
          flaky_score?: number;
          last_run_at?: string | null;
        };
        Update: {
          last_status?: ResultStatus | null;
          failure_streak?: number;
          flaky_score?: number;
          last_run_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "automated_test_catalog_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_api_tokens: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          token_hash: string;
          token_prefix: string;
          created_by: string | null;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          token_hash: string;
          token_prefix: string;
          created_by?: string | null;
        };
        Update: {
          last_used_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_api_tokens_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_component_coverage: {
        Row: {
          project_id: string;
          component_id: string;
          component_name: string;
          total_cases: number;
          automated_cases: number;
          manual_cases: number;
          automation_percent: number;
        };
        Relationships: [];
      };
      v_test_run_summary: {
        Row: {
          test_run_id: string;
          project_id: string;
          name: string;
          status: TestRunStatus;
          started_at: string;
          finished_at: string | null;
          total_results: number;
          passed: number;
          failed: number;
          blocked: number;
          skipped: number;
          flaky: number;
          pass_rate_percent: number | null;
        };
        Relationships: [];
      };
      v_defect_metrics: {
        Row: {
          project_id: string;
          total_defects: number;
          open_defects: number;
          critical_count: number;
          high_count: number;
          medium_count: number;
          low_count: number;
          mttr_hours: number | null;
        };
        Relationships: [];
      };
      v_flaky_tests: {
        Row: {
          project_id: string;
          automated_test_id: string;
          name: string;
          suite: string | null;
          framework: TestFramework | null;
          last_status: ResultStatus | null;
          failure_streak: number;
          flaky_score: number;
          last_run_at: string | null;
        };
        Relationships: [];
      };
      v_pass_rate_trend: {
        Row: {
          project_id: string;
          test_run_id: string;
          name: string;
          finished_at: string | null;
          pass_rate_percent: number | null;
          total_results: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
