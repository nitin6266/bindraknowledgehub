"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, UserCog, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { DocumentUpload } from "@/features/student/components/document-upload";
import {
  updateStudentAction,
  promoteStudentAction,
  transferStudentAction,
} from "@/features/student/actions/student.actions";
import { STUDENT_STATUS_OPTIONS, type StudentStatusValue } from "@/features/student/student.constants";
import type {
  StudentDetail,
  Option,
  PromoteValues,
  TransferValues,
} from "@/features/student/student.types";

interface StudentDetailClientProps {
  detail: StudentDetail;
  options: {
    sessions: Option[];
    classes: Option[];
    batches: Option[];
  };
  canManage: boolean;
}

function statusBadge(status: string) {
  const map: Record<string, "success" | "outline"> = {
    ACTIVE: "success",
    INACTIVE: "outline",
    LEFT: "outline",
    GRADUATED: "outline",
  };
  return <Badge variant={map[status] ?? "outline"}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

function initials(name: string) {
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (!parts.length) return "";
  return parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");
}

export function StudentDetailClient({ detail, options, canManage }: StudentDetailClientProps) {
  const router = useRouter();
  const { student, parents, emergencyContacts, medicalInformation, documents, batchHistory, promotionHistory, currentBatch } = detail;
  const fullName = `${student.firstName} ${student.lastName}`.trim();

  const [editOpen, setEditOpen] = useState(false);
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => router.push("/dashboard/students")} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to students
        </Button>
        {canManage ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={() => setTransferOpen(true)}>
              <UserCog className="h-4 w-4" /> Transfer
            </Button>
            <Button onClick={() => setPromoteOpen(true)}>
              <GraduationCap className="h-4 w-4" /> Promote
            </Button>
          </div>
        ) : null}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-h4 font-semibold text-primary">
            {initials(fullName)}
          </div>
          <div className="space-y-1">
            <h1 className="text-h3 font-semibold text-foreground">{fullName}</h1>
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-muted-foreground">
              <span className="font-mono">{student.admissionNumber}</span>
              <span aria-hidden>•</span>
              <span>{student.className}{student.sectionName ? ` / ${student.sectionName}` : ""}</span>
              <span aria-hidden>•</span>
              <span>{student.sessionName}</span>
              <span aria-hidden>•</span>
              {statusBadge(student.status)}
            </div>
            <p className="text-caption text-muted-foreground">
              {currentBatch ? `Batch: ${currentBatch.name}` : "No active batch"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-body-md">Parents / Guardians</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {parents.length ? (
              parents.map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-body-sm font-medium text-foreground">{(p as { parentName?: string }).parentName ?? "Parent"}</p>
                    <Badge variant="outline">{p.relationship.replace(/_/g, " ")}</Badge>
                  </div>
                  <p className="text-caption text-muted-foreground">{p.parentEmail}</p>
                  {p.parentPhone ? <p className="text-caption text-muted-foreground">{p.parentPhone}</p> : null}
                  {p.isPrimary ? <p className="text-caption text-primary">Primary contact</p> : null}
                </div>
              ))
            ) : (
              <p className="text-body-sm text-muted-foreground">No parent records.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-body-md">Emergency Contacts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.length ? (
              emergencyContacts.map((ec) => (
                <div key={ec.id} className="rounded-lg border border-border p-3">
                  <p className="text-body-sm font-medium text-foreground">{ec.contactName} <span className="text-caption text-muted-foreground">({ec.relationship})</span></p>
                  <p className="text-caption text-muted-foreground">{ec.phoneNumber}{ec.alternatePhone ? ` / ${ec.alternatePhone}` : ""}</p>
                  {ec.email ? <p className="text-caption text-muted-foreground">{ec.email}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-body-sm text-muted-foreground">No emergency contacts.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-body-md">Medical Information</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-body-sm text-muted-foreground">
            {medicalInformation ? (
              <>
                <p><span className="text-foreground">Blood group:</span> {medicalInformation.bloodGroup ?? "—"}</p>
                <p><span className="text-foreground">Conditions:</span> {medicalInformation.medicalConditions ?? "—"}</p>
                <p><span className="text-foreground">Allergies:</span> {medicalInformation.allergies ?? "—"}</p>
                <p><span className="text-foreground">Medication:</span> {medicalInformation.medication ?? "—"}</p>
                {medicalInformation.notes ? <p className="whitespace-pre-wrap"><span className="text-foreground">Notes:</span> {medicalInformation.notes}</p> : null}
              </>
            ) : (
              <p>No medical information recorded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-body-md">Basic Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-body-sm text-muted-foreground">
            <Detail label="Date of birth" value={formatDate(student.dateOfBirth)} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Address" value={student.address ?? "—"} />
            <Detail label="City" value={student.city ?? "—"} />
            <Detail label="State" value={student.state ?? "—"} />
            <Detail label="Country" value={student.country ?? "—"} />
            <Detail label="Pincode" value={student.pincode ?? "—"} span />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-body-md">Batch History</CardTitle></CardHeader>
        <CardContent>
          {batchHistory.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">Batch</th>
                    <th className="py-2 pr-4">Session</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">From</th>
                    <th className="py-2 pr-4">To</th>
                  </tr>
                </thead>
                <tbody>
                  {batchHistory.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="py-2 pr-4 text-foreground">{b.batchName}</td>
                      <td className="py-2 pr-4">{b.sessionName}</td>
                      <td className="py-2 pr-4">{b.changeType.replace(/_/g, " ")}</td>
                      <td className="py-2 pr-4">{formatDate(b.startDate)}</td>
                      <td className="py-2 pr-4">{b.endDate ? formatDate(b.endDate) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground">No batch history.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-body-md">Promotion History</CardTitle></CardHeader>
        <CardContent>
          {promotionHistory.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2 pr-4">From</th>
                    <th className="py-2 pr-4">To</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionHistory.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="py-2 pr-4 text-foreground">{p.fromClassName ?? "—"}</td>
                      <td className="py-2 pr-4 text-foreground">{p.toClassName}</td>
                      <td className="py-2 pr-4">{formatDate(p.promotionDate)}</td>
                      <td className="py-2 pr-4">{p.note ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-body-sm text-muted-foreground">No promotion history.</p>
          )}
        </CardContent>
      </Card>

      <DocumentUpload studentId={student.id} documents={documents} />

      {canManage ? (
        <>
          <EditDialog open={editOpen} onOpenChange={setEditOpen} detail={detail} />
          <PromoteDialog open={promoteOpen} onOpenChange={setPromoteOpen} studentId={student.id} options={options} />
          <TransferDialog open={transferOpen} onOpenChange={setTransferOpen} studentId={student.id} currentBatchName={currentBatch?.name ?? null} options={options} />
        </>
      ) : null}
    </div>
  );
}

function Detail({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <p className="text-caption uppercase tracking-wide">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function EditDialog({ open, onOpenChange, detail }: { open: boolean; onOpenChange: (o: boolean) => void; detail: StudentDetail }) {
  const router = useRouter();
  const s = detail.student;
  const [status, setStatus] = useState<string>(s.status);
  const [address, setAddress] = useState(s.address ?? "");
  const [bloodGroup, setBloodGroup] = useState(detail.medicalInformation?.bloodGroup ?? "");
  const [medicalConditions, setMedicalConditions] = useState(detail.medicalInformation?.medicalConditions ?? "");
  const [allergies, setAllergies] = useState(detail.medicalInformation?.allergies ?? "");
  const ec = detail.emergencyContacts[0];
  const [contactName, setContactName] = useState(ec?.contactName ?? "");
  const [relationship, setRelationship] = useState(ec?.relationship ?? "");
  const [phoneNumber, setPhoneNumber] = useState(ec?.phoneNumber ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await updateStudentAction(s.id, {
        status: status as StudentStatusValue,
        address: address || null,
        bloodGroup: bloodGroup || null,
        medical: {
          conditions: medicalConditions || undefined,
          allergies: allergies || undefined,
          notes: undefined,
        },
        emergencyContacts: [
          {
            contactName,
            relationship,
            phoneNumber,
          },
        ],
      });
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Update failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit student</DialogTitle>
          <DialogDescription>Update core details, medical info and emergency contact.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edStatus">Status</Label>
              <Select id="edStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STUDENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edAddr">Address</Label>
            <Textarea id="edAddr" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="edBlood">Blood group</Label>
              <Input id="edBlood" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edCond">Medical conditions</Label>
              <Input id="edCond" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edAllergy">Allergies</Label>
              <Input id="edAllergy" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="edEcName">Emergency contact</Label>
              <Input id="edEcName" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edEcRel">Relationship</Label>
              <Input id="edEcRel" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edEcPhone">Phone</Label>
              <Input id="edEcPhone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
          </div>
          {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Cancel</Button></DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PromoteDialog({ open, onOpenChange, studentId, options }: { open: boolean; onOpenChange: (o: boolean) => void; studentId: string; options: StudentDetailClientProps["options"] }) {
  const router = useRouter();
  const [toSessionId, setToSessionId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!toSessionId || !toClassId) {
      setError("Select target session and class.");
      return;
    }
    setPending(true);
    try {
      const result = await promoteStudentAction(studentId, { toSessionId, toClassId, note } as PromoteValues);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Promotion failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote student</DialogTitle>
          <DialogDescription>Move the student to the next session and class.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prSession">Target session</Label>
              <Select id="prSession" value={toSessionId} onChange={(e) => setToSessionId(e.target.value)}>
                <option value="">Select session</option>
                {options.sessions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prClass">Target class</Label>
              <Select id="prClass" value={toClassId} onChange={(e) => setToClassId(e.target.value)}>
                <option value="">Select class</option>
                {options.classes.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prNote">Note</Label>
            <Textarea id="prNote" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Cancel</Button></DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>Promote</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({ open, onOpenChange, studentId, currentBatchName, options }: { open: boolean; onOpenChange: (o: boolean) => void; studentId: string; currentBatchName: string | null; options: StudentDetailClientProps["options"] }) {
  const router = useRouter();
  const [toBatchId, setToBatchId] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!toBatchId) {
      setError("Select a target batch.");
      return;
    }
    setPending(true);
    try {
      const result = await transferStudentAction(studentId, { toBatchId, reason } as TransferValues);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Transfer failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer batch</DialogTitle>
          <DialogDescription>
            {currentBatchName ? `Current batch: ${currentBatchName}. ` : ""}Move the student to a different batch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="trBatch">Target batch</Label>
            <Select id="trBatch" value={toBatchId} onChange={(e) => setToBatchId(e.target.value)}>
              <option value="">Select batch</option>
              {options.batches.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="trReason">Reason</Label>
            <Textarea id="trReason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Cancel</Button></DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>Transfer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
