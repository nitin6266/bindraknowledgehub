/**
 * Supabase database type stub for Auth client calls.
 * Run `npx supabase gen types typescript --project-id <ref> --schema public`
 * and replace this file once the schema is managed by Supabase.
 *
 * The Prisma-managed ERP tables (Role, User, UserProfile, AuditLog) are
 * accessed through `@prisma/client`, not this Supabase client type.
 */
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
