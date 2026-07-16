import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { userRepository } from "@/repositories/user.repository";
import { roleRepository } from "@/repositories/role.repository";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserCog } from "lucide-react";

export const dynamic = "force-dynamic";

interface TeachersPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function TeachersPage({ searchParams }: TeachersPageProps) {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);

  const teacherRole = await roleRepository.getByName(ROLES.TEACHER);
  const sp = await searchParams;
  const search = sp.search?.trim();

  const users = await userRepository.list(
    teacherRole ? { roleId: teacherRole.id, search: search || undefined } : {},
  );

  const teachers = users.map((u) => ({
    id: u.id,
    fullName: `${u.profile?.firstName ?? ""} ${u.profile?.lastName ?? ""}`.trim() || u.email,
    email: u.email,
    phone: u.profile?.phone ?? null,
    status: u.status,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Management"
        title="Teachers"
        description="All teaching staff with access to the teacher portal."
      />

      {teachers.length === 0 ? (
        <EmptyState
          icon={<UserCog className="h-8 w-8" />}
          title="No teachers found"
          description="Teachers will appear here once their accounts are created."
        />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium text-foreground">{t.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{t.email}</TableCell>
                  <TableCell className="text-muted-foreground">{t.phone ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "ACTIVE" ? "success" : "outline"}>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
