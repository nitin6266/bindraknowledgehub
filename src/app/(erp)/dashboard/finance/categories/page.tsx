import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getFeeCategories, deleteFeeCategory } from "@/features/finance/actions/finance.actions";
import { FeeCategoryForm } from "@/features/finance/components/fee-category-form";
import { DeleteButton } from "@/features/finance/components/delete-button";

export const dynamic = "force-dynamic";

interface CategoriesPageProps {
  searchParams: Promise<{ mode?: string; edit?: string }>;
}

export default async function FeeCategoriesPage({ searchParams }: CategoriesPageProps) {
  const sp = await searchParams;
  const res = await getFeeCategories();
  const categories = res.success ? res.data : [];
  const editing = sp.edit ? categories.find((c) => c.id === sp.edit) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Categories"
        description="Define fee categories such as tuition, admission, exam fees"
        action={
          !sp.mode && !sp.edit ? (
            <Link href="/dashboard/finance/categories?mode=new">
              <Button>New Category</Button>
            </Link>
          ) : undefined
        }
      />

      {(sp.mode === "new" || editing) && (
        <FeeCategoryForm
          initial={editing ? { id: editing.id, name: editing.name, description: editing.description, status: editing.status } : undefined}
        />
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-body text-muted-foreground">No categories yet.</CardContent>
          </Card>
        ) : (
          categories.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{c.name}</CardTitle>
                  <Badge variant={c.status === "ACTIVE" ? "success" : "outline"}>{c.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-body-sm text-muted-foreground">{c.description ?? "—"}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/finance/categories?edit=${c.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                  <DeleteButton id={c.id} action={deleteFeeCategory} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
