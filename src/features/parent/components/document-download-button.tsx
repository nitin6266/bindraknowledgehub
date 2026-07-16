"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { logDocumentAccess } from "@/features/parent/actions/parent.actions";

interface DocumentDownloadButtonProps {
  url: string;
  studentId: string | null;
  documentType: string;
  label?: string;
}

export function DocumentDownloadButton({
  url,
  studentId,
  documentType,
  label = "Download",
}: DocumentDownloadButtonProps) {
  const [logging, setLogging] = useState(false);

  async function handleClick() {
    setLogging(true);
    try {
      await logDocumentAccess(studentId, documentType, url);
    } finally {
      setLogging(false);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={logging} className="gap-1.5">
      <Download className="size-4" />
      {label}
    </Button>
  );
}
