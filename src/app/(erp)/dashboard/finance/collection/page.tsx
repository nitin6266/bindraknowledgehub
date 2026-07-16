import { PageHeader } from "@/components/page-header";

import { getStudentFees } from "@/features/finance/actions/finance.actions";
import { FeeCollectionScreen } from "@/features/finance/components/fee-collection-screen";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  searchParams: Promise<{ studentFee?: string }>;
}

export default async function FeeCollectionPage({ searchParams }: CollectionPageProps) {
  const sp = await searchParams;
  const res = await getStudentFees({});
  const fees = res.success ? res.data : [];

  const studentFees = fees.map((f) => ({
    id: f.id,
    label: `${f.studentName} · ${f.categoryName} · ${f.className}`,
    dueAmount: f.dueAmount,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Collection" description="Record payments and generate receipts" />
      <FeeCollectionScreen studentFees={studentFees} defaultId={sp.studentFee} />
    </div>
  );
}
