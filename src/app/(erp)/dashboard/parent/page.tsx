import Link from "next/link";
import { Users, UserCheck, UserX, FileClock, BookOpen, Megaphone } from "lucide-react";

import { PageHeader } from "@/features/dashboard/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getParentDashboardStats, listAnnouncements, getParentProfile } from "@/features/parent/actions/parent.actions";
import { StatCard } from "@/features/parent/components/stat-card";
import { ChildCard } from "@/features/parent/components/child-card";

export const dynamic = "force-dynamic";

export default async function ParentDashboardPage() {
  const [statsRes, annRes, profileRes] = await Promise.all([
    getParentDashboardStats(),
    listAnnouncements(),
    getParentProfile(),
  ]);

  const stats = statsRes.success ? statsRes.data.stats : null;
  const children = statsRes.success ? statsRes.data.children : [];
  const announcements = annRes.success ? annRes.data : [];
  const parentName = profileRes.success && profileRes.data ? profileRes.data.firstName : "";

  return (
    <div className="space-y-6">
      <PageHeader
        title={parentName ? `Welcome, ${parentName}` : "Parent Dashboard"}
        description="Track your child's attendance, assignments, results and school updates"
      />

      {children.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">
            No children are linked to your account yet. Please contact the school administration to link your
            child&apos;s profile.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard label="Children" value={stats?.childrenCount ?? 0} icon={<Users className="size-5" />} />
            <StatCard label="Present Today" value={stats?.presentToday ?? 0} icon={<UserCheck className="size-5" />} tone="success" />
            <StatCard label="Absent Today" value={stats?.absentToday ?? 0} icon={<UserX className="size-5" />} tone="danger" />
            <StatCard label="Pending Leaves" value={stats?.pendingLeaves ?? 0} icon={<FileClock className="size-5" />} tone="warning" />
            <StatCard label="Open Tasks" value={stats?.pendingAssignments ?? 0} icon={<BookOpen className="size-5" />} tone="accent" />
            <StatCard label="Updates" value={stats?.unreadAnnouncements ?? 0} icon={<Megaphone className="size-5" />} />
          </div>

          <section className="space-y-3">
            <h2 className="text-h4 font-semibold">My Children</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {children.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          </section>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-semibold">Quick Actions</h2>
          </div>
          <Card>
            <CardContent className="grid gap-2 p-4">
              <Link href="/dashboard/parent/attendance">
                <Button variant="outline" className="w-full justify-start">View Attendance</Button>
              </Link>
              <Link href="/dashboard/parent/assignments">
                <Button variant="outline" className="w-full justify-start">Check Assignments</Button>
              </Link>
              <Link href="/dashboard/parent/results">
                <Button variant="outline" className="w-full justify-start">Test Results</Button>
              </Link>
              <Link href="/dashboard/parent/leave">
                <Button variant="outline" className="w-full justify-start">Apply for Leave</Button>
              </Link>
              <Link href="/dashboard/parent/fees">
                <Button variant="outline" className="w-full justify-start">Fee Summary</Button>
              </Link>
              <Link href="/dashboard/parent/documents">
                <Button variant="outline" className="w-full justify-start">Documents</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 font-semibold">School Updates</h2>
            <Link href="/dashboard/parent/announcements" className="text-body-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <Card>
            <CardContent className="space-y-3 p-4">
              {announcements.length === 0 ? (
                <p className="text-body-sm text-muted-foreground">No announcements yet.</p>
              ) : (
                announcements.slice(0, 4).map((a) => (
                  <div key={a.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="text-body-base font-medium">{a.title}</p>
                    <p className="line-clamp-2 text-body-sm text-muted-foreground">{a.body}</p>
                    <p className="mt-1 text-caption text-muted-foreground">
                      {a.publishedByName} · {a.publishedAt}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
