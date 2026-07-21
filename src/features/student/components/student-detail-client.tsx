"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft, Pencil, GraduationCap, ArrowRightLeft,
  Calendar, Phone, Heart, FileText, User,
  Users, AlertTriangle, Clock, CreditCard, BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";
import type { StudentDetail, Option } from "@/features/student/student.types";

interface StudentDetailClientProps {
  detail: StudentDetail;
  options: { sessions: Option[]; classes: Option[]; batches: Option[] };
  canManage: boolean;
}

const STATUS: Record<string, { dot: string; label: string }> = {
  ACTIVE: { dot: "bg-success", label: "Active" },
  INACTIVE: { dot: "bg-muted-foreground", label: "Inactive" },
  LEFT: { dot: "bg-danger", label: "Left" },
  GRADUATED: { dot: "bg-info", label: "Graduated" },
};

function initials(name: string) {
  const p = name.split(" ").filter(Boolean);
  return p.length ? p.slice(0, 2).map((s) => s[0]!.toUpperCase()).join("") : "?";
}

export function StudentDetailClient({ detail, canManage }: StudentDetailClientProps) {
  const router = useRouter();
  const { student, parents, emergencyContacts, medicalInformation, documents, batchHistory, promotionHistory, currentBatch } = detail;
  const fullName = `${student.firstName} ${student.lastName}`.trim();
  const status = STATUS[student.status] ?? { dot: "bg-muted-foreground", label: student.status };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/students")}
          className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground/50 hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to students
        </button>

        <div className="flex gap-6">
          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside className="w-[260px] shrink-0">
            <div className="sticky top-6 space-y-5">
              <div className="rounded-[10px] border border-border/50 bg-card p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="size-[88px] rounded-[10px] bg-primary/[0.04] mb-3">
                    <AvatarImage src={student.photoUrl ?? undefined} />
                    <AvatarFallback className="rounded-[10px] text-2xl font-semibold text-primary">
                      {initials(fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-[22px] font-semibold text-foreground leading-tight">{fullName}</h1>
                  <p className="text-[12px] font-mono text-muted-foreground/50 mt-0.5">{student.admissionNumber}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={cn("size-1.5 rounded-full", status.dot)} />
                    <span className="text-[12px] font-medium text-muted-foreground/70">{status.label}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 space-y-2.5">
                  <MetaRow icon={<BookOpen className="size-3.5" />} label="Class" value={student.className} />
                  {student.sectionName && <MetaRow icon={<BookOpen className="size-3.5" />} label="Section" value={student.sectionName} />}
                  {currentBatch && <MetaRow icon={<Users className="size-3.5" />} label="Batch" value={currentBatch.name} />}
                  <MetaRow icon={<Calendar className="size-3.5" />} label="Session" value={student.sessionName} />
                  {student.rollNumber && <MetaRow icon={<HashIcon />} label="Roll no" value={student.rollNumber} />}
                </div>

                {canManage && (
                  <div className="mt-4 pt-3 border-t border-border/40 space-y-1">
                    <ActionBtn icon={<Pencil className="size-3.5" />} label="Edit details" onClick={() => router.push(`/dashboard/students/${student.id}/edit`)} />
                    <ActionBtn icon={<ArrowRightLeft className="size-3.5" />} label="Transfer batch" onClick={() => router.push(`/dashboard/students/${student.id}/transfer`)} />
                    <ActionBtn icon={<GraduationCap className="size-3.5" />} label="Promote class" onClick={() => router.push(`/dashboard/students/${student.id}/promote`)} highlight />
                  </div>
                )}
              </div>

              <div className="rounded-[10px] border border-border/50 bg-card p-6 space-y-2.5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/40">Quick Info</h3>
                <SideField label="Date of birth" value={formatDate(student.dateOfBirth)} />
                <SideField label="Gender" value={student.gender} />
                <SideField label="Blood group" value={student.bloodGroup ?? "—"} />
                <SideField label="City" value={student.city ?? "—"} />
              </div>
            </div>
          </aside>

          {/* ── Main content ────────────────────────────────── */}
          <main className="flex-1 min-w-0 space-y-5 pb-12">

            <CardSection icon={<User className="size-4" />} title="Personal Details">
              <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em] mb-3">Basic Information</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 mb-4">
                <DetailField label="Date of birth" value={formatDate(student.dateOfBirth)} />
                <DetailField label="Gender" value={student.gender} />
                <DetailField label="Blood group" value={student.bloodGroup ?? "—"} />
                <DetailField label="Roll number" value={student.rollNumber ?? "—"} />
              </div>
              <hr className="border-border/20 mb-4" />
              <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em] mb-3">Address</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                <DetailField label="Street address" value={student.address ?? "—"} className="col-span-2" />
                <DetailField label="City" value={student.city ?? "—"} />
                <DetailField label="State" value={student.state ?? "—"} />
                <DetailField label="Country" value={student.country ?? "—"} />
                <DetailField label="Pincode" value={student.pincode ?? "—"} />
              </div>
            </CardSection>

            <CardSection icon={<Users className="size-4" />} title="Parents / Guardians">
              {parents.length > 0 ? (
                <div className="grid gap-3">
                  {parents.map((p) => (
                    <ParentCard
                      key={p.id}
                      name={p.parentName ?? "Parent"}
                      email={p.parentEmail}
                      phone={p.parentPhone}
                      relationship={p.relationship.replace(/_/g, " ")}
                      isPrimary={p.isPrimary}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="No parent records" />
              )}
            </CardSection>

            <CardSection icon={<AlertTriangle className="size-4" />} title="Emergency Contacts">
              {emergencyContacts.length > 0 ? (
                <div className="grid gap-3">
                  {emergencyContacts.map((ec) => (
                    <EmergencyCard key={ec.id} contact={ec} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No emergency contacts" />
              )}
            </CardSection>

            <CardSection icon={<Heart className="size-4" />} title="Medical Information">
              {medicalInformation ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                  <DetailField label="Blood group" value={medicalInformation.bloodGroup ?? "—"} />
                  <DetailField label="Conditions" value={medicalInformation.medicalConditions ?? "—"} />
                  <DetailField label="Allergies" value={medicalInformation.allergies ?? "—"} />
                  <DetailField label="Medication" value={medicalInformation.medication ?? "—"} />
                  {medicalInformation.notes && <DetailField label="Notes" value={medicalInformation.notes} className="col-span-2" />}
                </div>
              ) : (
                <EmptyState message="No medical information recorded" />
              )}
            </CardSection>

            <CardSection icon={<FileText className="size-4" />} title="Documents">
              {documents.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {documents.map((doc) => (
                    <DocRow key={doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <EmptyState message="No documents uploaded" />
              )}
            </CardSection>

            <CardSection icon={<GraduationCap className="size-4" />} title="Promotion & Batch History">
              {promotionHistory.length > 0 || batchHistory.length > 0 ? (
                <div className="space-y-5">
                  {batchHistory.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 mb-2.5">Batch Changes</h4>
                      <Timeline>
                        {batchHistory.map((b) => (
                          <TimelineItem key={b.id}>
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-medium text-foreground">{b.batchName}</span>
                              <span className="text-[12px] text-muted-foreground/50">{b.sessionName}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider">{b.changeType.replace(/_/g, " ")}</span>
                              <span className="text-[11px] text-muted-foreground/40">·</span>
                              <span className="text-[12px] text-muted-foreground/50">{formatDate(b.startDate)}{b.endDate ? ` → ${formatDate(b.endDate)}` : ""}</span>
                            </div>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </div>
                  )}
                  {promotionHistory.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 mb-2.5">Promotions</h4>
                      <Timeline>
                        {promotionHistory.map((p) => (
                          <TimelineItem key={p.id}>
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] text-foreground">
                                <span className="text-muted-foreground/50">{p.fromClassName ?? "—"}</span>
                                <span className="mx-2 text-muted-foreground/30">→</span>
                                <span className="font-medium">{p.toClassName}</span>
                              </span>
                              <span className="text-[12px] text-muted-foreground/50">{formatDate(p.promotionDate)}</span>
                            </div>
                            {p.note && <p className="text-[12px] text-muted-foreground/50 mt-0.5">{p.note}</p>}
                          </TimelineItem>
                        ))}
                      </Timeline>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState message="No promotion history" />
              )}
            </CardSection>

            <div className="grid grid-cols-2 gap-5">
              <ForthcomingCard icon={<Clock className="size-4" />} title="Attendance">
                <div className="flex items-center gap-5">
                  <Metric value="94%" label="This month" />
                  <Metric value="92%" label="Last month" />
                  <Metric value="93%" label="Overall" />
                </div>
              </ForthcomingCard>
              <ForthcomingCard icon={<CreditCard className="size-4" />} title="Fee Summary">
                <div className="flex items-center gap-5">
                  <Metric value="₹45,000" label="Total" />
                  <Metric value="₹35,000" label="Paid" color="text-success" />
                  <Metric value="₹10,000" label="Due" color="text-danger" />
                </div>
              </ForthcomingCard>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function CardSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-border/40 bg-card">
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-border/30">
        <span className="text-muted-foreground/40">{icon}</span>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      <div className="px-5 py-4">
        {children}
      </div>
    </div>
  );
}

function ForthcomingCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border border-border/30 bg-card/50">
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 border-b border-border/20">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground/40">{icon}</span>
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        </div>
        <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-wider">Coming soon</span>
      </div>
      <div className="px-4 py-3.5">
        {children}
      </div>
    </div>
  );
}

function DetailField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-[0.04em] mb-0.5">{label}</p>
      <p className="text-[15px] text-foreground leading-snug">{value}</p>
    </div>
  );
}

function SideField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.06em]">{label}</p>
      <p className="text-[13px] text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-muted-foreground/40 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.06em]">{label}</p>
        <p className="text-[13px] text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, highlight }: { icon: React.ReactNode; label: string; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13px] font-medium transition-colors",
        highlight
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary",
      )}
    >
      <span className="shrink-0">{icon}</span>
      {label}
    </button>
  );
}

function ParentCard({ name, email, phone, relationship, isPrimary }: { name: string; email: string | null; phone: string | null; relationship: string; isPrimary: boolean }) {
  return (
    <div className="rounded-[8px] border border-border/40 bg-secondary/30 p-3.5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-[8px] bg-primary/[0.06] text-primary shrink-0">
            <User className="size-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-medium text-foreground">{name}</p>
              {isPrimary && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Primary</span>}
            </div>
            {email && <p className="text-[13px] text-muted-foreground/70">{email}</p>}
            {phone && <p className="text-[13px] font-mono text-muted-foreground/60">{phone}</p>}
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground/50 capitalize">{relationship}</span>
      </div>
    </div>
  );
}

function EmergencyCard({ contact }: { contact: { id: string; contactName: string; relationship: string; phoneNumber: string; alternatePhone: string | null; email: string | null } }) {
  return (
    <div className="rounded-[8px] border border-border/40 bg-secondary/30 p-3.5">
      <div className="flex items-start gap-3">
        <div className="flex size-8 items-center justify-center rounded-[8px] bg-danger/[0.06] text-danger shrink-0">
          <Phone className="size-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-foreground">{contact.contactName}</p>
            <span className="text-[11px] text-muted-foreground/50">({contact.relationship})</span>
          </div>
          <p className="text-[13px] font-mono text-muted-foreground/70 mt-0.5">{contact.phoneNumber}</p>
          {contact.alternatePhone && (
            <p className="text-[12px] font-mono text-muted-foreground/50 mt-0.5">Alt: {contact.alternatePhone}</p>
          )}
          {contact.email && (
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">{contact.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc }: { doc: { id: string; documentType: string; fileName: string; fileUrl: string; uploadedAt: string } }) {
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <FileText className="size-4 text-muted-foreground/30 shrink-0" />
        <div>
          <p className="text-[14px] font-medium text-foreground">{doc.documentType.replace(/_/g, " ")}</p>
          <p className="text-[12px] text-muted-foreground/50">{doc.fileName}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[11px] text-muted-foreground/40">{formatDate(doc.uploadedAt)}</span>
        {doc.fileUrl && (
          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-[12px] font-medium text-primary hover:underline">
            View
          </a>
        )}
      </div>
    </div>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2.5">{children}</div>;
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-4 border-l-2 border-border/50 pb-2.5 last:pb-0">
      <div className="absolute left-[-4.5px] top-1 size-2 rounded-full bg-border/80" />
      {children}
    </div>
  );
}

function Metric({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div>
      <p className={cn("text-[20px] font-semibold tabular-nums tracking-tight", color ?? "text-foreground")}>{value}</p>
      <p className="text-[12px] text-muted-foreground/60">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-[14px] text-muted-foreground/50 py-1.5">{message}</p>
  );
}

function HashIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="12" y2="6" />
      <line x1="4" y1="10" x2="12" y2="10" />
      <line x1="6" y1="2" x2="6" y2="14" />
      <line x1="10" y1="2" x2="10" y2="14" />
    </svg>
  );
}
