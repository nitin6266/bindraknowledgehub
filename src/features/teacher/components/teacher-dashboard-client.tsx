"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Users, FileText, CheckSquare, AlertCircle, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

import { getDashboardStats } from "@/features/teacher/actions/teacher.actions";
import { getTodayClasses } from "@/features/teacher/actions/teacher.actions";
import type { DashboardStats, TodayClass } from "@/features/teacher/teacher.types";

export function TeacherDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [classes, setClasses] = useState<TodayClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, classesRes] = await Promise.all([
          getDashboardStats(),
          getTodayClasses(),
        ]);
        if (statsRes.success) setStats(statsRes.data as DashboardStats);
        if (classesRes.success) setClasses(classesRes.data as TodayClass[]);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    { title: "Today's Classes", value: stats?.todaysClasses ?? 0, icon: Calendar, tone: "bg-primary/10 text-primary" },
    { title: "Upcoming Classes", value: stats?.upcomingClasses ?? 0, icon: Clock, tone: "bg-info/10 text-info" },
    { title: "Pending Attendance", value: stats?.pendingAttendance ?? 0, icon: Users, tone: "bg-warning/15 text-warning" },
    { title: "Pending Assignments", value: stats?.pendingAssignments ?? 0, icon: FileText, tone: "bg-accent/15 text-accent" },
    { title: "Pending Evaluations", value: stats?.pendingTestEvaluations ?? 0, icon: CheckSquare, tone: "bg-danger/15 text-danger" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(({ title, value, icon: Icon, tone }) => (
          <Card key={title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
                <div className={`p-2 rounded-lg ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Schedule</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/teacher/attendance">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Spinner className="mr-2 h-4 w-4" /> Loading schedule...
              </div>
            ) : classes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No classes scheduled today</p>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cls.batchName}</p>
                        <p className="text-sm text-muted-foreground">{cls.subjectName} • {cls.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={cls.attendanceStatus === "COMPLETED" ? "success" : "outline"}>
                        {cls.attendanceStatus.replace("_", " ")}
                      </Badge>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/teacher/attendance?batch=${cls.batchId}&subject=${cls.subjectId}`}>
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="h-auto p-4 flex flex-col items-start gap-1" asChild>
                <Link href="/dashboard/teacher/attendance">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Take Attendance</p>
                      <p className="text-xs text-muted-foreground">Mark today's attendance</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button className="h-auto p-4 flex flex-col items-start gap-1" asChild>
                <Link href="/dashboard/teacher/assignments/new">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-accent/15 text-accent">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Create Assignment</p>
                      <p className="text-xs text-muted-foreground">Upload & publish</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button className="h-auto p-4 flex flex-col items-start gap-1" asChild>
                <Link href="/dashboard/teacher/tests/new">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-success/15 text-success">
                      <CheckSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Create Test</p>
                      <p className="text-xs text-muted-foreground">Schedule assessment</p>
                    </div>
                  </div>
                </Link>
              </Button>
              <Button className="h-auto p-4 flex flex-col items-start gap-1" asChild>
                <Link href="/dashboard/teacher/marks">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-warning/15 text-warning">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Enter Marks</p>
                      <p className="text-xs text-muted-foreground">Grade tests</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No announcements yet"
            description="School-wide updates will appear here. View all in Notifications."
          />
        </CardContent>
      </Card>
    </div>
  );
}
