import type { Metadata } from "next";
import { buildMetadata } from "@/lib/site";
import { pages } from "@/content/pages";
import { PagePlaceholder } from "@/components/sections/placeholder";

const page = pages.gallery;

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.description,
  alternates: { canonical: page.slug },
});

export default function GalleryPage() {
  return <PagePlaceholder page={page} />;
}
