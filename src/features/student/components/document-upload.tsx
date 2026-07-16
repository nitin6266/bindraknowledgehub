"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Trash2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { uploadDocumentAction, removeDocumentAction } from "@/features/student/actions/student.actions";
import { STUDENT_DOCUMENT_TYPES } from "@/features/student/student.constants";
import type { StudentDocumentData } from "@/features/student/student.types";

interface DocumentUploadProps {
  studentId: string;
  documents: StudentDocumentData[];
}

export function DocumentUpload({ studentId, documents }: DocumentUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (!documentType) {
      setError("Select a document type.");
      return;
    }
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("studentId", studentId);
      fd.append("type", documentType);
      fd.append("file", file);
      if (description) fd.append("description", description);
      const result = await uploadDocumentAction(fd);
      if (result.success) {
        setFile(null);
        setDocumentType("");
        setDescription("");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleRemove(docId: string) {
    setPending(true);
    try {
      await removeDocumentAction(studentId, docId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-body-md">Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleUpload} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3 sm:items-end">
          <div className="space-y-1.5 sm:col-span-1">
            <Label htmlFor="docType">Type</Label>
            <Select id="docType" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              <option value="">Select type</option>
              {STUDENT_DOCUMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-1">
            <Label htmlFor="docFile">File</Label>
            <Input id="docFile" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="space-y-1.5 sm:col-span-1">
            <Label htmlFor="docDesc">Description</Label>
            <Input id="docDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" loading={pending} disabled={pending}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
            {error ? <p className="mt-2 text-body-sm text-destructive">{error}</p> : null}
          </div>
        </form>

        {documents.length ? (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-foreground">{doc.documentType.replace(/_/g, " ")}</p>
                    <p className="truncate text-caption text-muted-foreground">{doc.description || doc.fileName}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {doc.fileUrl ? (
                    <Button variant="ghost" size="icon" asChild aria-label="Open document">
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                  <Button variant="ghost" size="icon" aria-label="Remove document" onClick={() => handleRemove(doc.id)} disabled={pending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body-sm text-muted-foreground">No documents uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
