import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  getFeeStructures,
  getFinanceOptions,
  deleteFeeStructure,
} from "@/features/finance/actions/finance.actions";
import { FeeStructureWizard } from "@/features/finance/components/fee-structure-wizard";
import { DeleteButton } from "@/features/finance/components/delete-button";

export const dynamic = "force-dynamic";

interface StructuresPageProps {
  searchParams: Promise<{ mode?: string }>;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function FeeStructuresPage({ searchParams }: StructuresPageProps) {
  const sp = await searchParams;
  const [structRes, optRes] = await Promise.all([getFeeStructures({}), getFinanceOptions()]);
  const structures = structRes.success ? structRes.data : [];
  const options = optRes.success ? optRes.data : { sessions: [], classes: [], batches: [], categories: [], structures: [] };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Structures"
        description="Templates defining fee amount, due date and late-fee rules"
        action={
          sp.mode !== "new" ? (
            <Link href="/dashboard/finance/structures?mode=new">
              <Button>New Structure</Button>
            </Link>
          ) : undefined
        }
      />

      {sp.mode === "new" && (
        <FeeStructureWizard
          options={{
            sessions: options.sessions,
            classes: options.classes,
            batches: options.batches,
            categories: options.categories,
          }}
        />
      )}

      <div className="grid gap-3">
        {structures.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-body text-muted-foreground">No fee structures yet.</CardContent>
          </Card>
        ) : (
          structures.map((s) => (
            <Card key={s.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-body-base font-semibold">{s.categoryName}</p>
                  <p className="text-body-xs text-muted-foreground">
                    {s.sessionName} · {s.className}
                    {s.batchName ? ` · ${s.batchName}` : ""}
                  </p>
                  <p className="text-body-xs text-muted-foreground">
                    Amount: {formatINR(s.amount)}
                    {s.dueDate ? ` · Due: ${s.dueDate}` : ""}
                    {s.lateFeeAmount > 0 ? ` · Late fee ₹${s.lateFeeAmount} after ${s.lateFeeAfterDays}d` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "ACTIVE" ? "success" : "outline"}>{s.status}</Badge>
                  <DeleteButton id={s.id} action={deleteFeeStructure} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
