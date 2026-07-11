import { Images, SearchX, FileQuestion, MessageSquareHeart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

/**
 * Domain-specific empty states. Each reuses the generic, accessible
 * EmptyState shell but ships copy/icon tuned to a real section so future
 * pages can drop them in without authoring copy in the component layer.
 */

export interface EmptyAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

function buildAction(action?: EmptyAction) {
  if (!action) return undefined;
  return (
    <Button asChild={Boolean(action.href)} variant="cta" size="sm" onClick={action.onClick}>
      {action.href ? <a href={action.href}>{action.label}</a> : action.label}
    </Button>
  );
}

export function NoGalleryEmpty({ action }: { action?: EmptyAction }) {
  return (
    <EmptyState
      icon={<Images aria-hidden="true" className="size-8" />}
      title="No photos yet"
      description="We're curating moments from classrooms, events and celebrations. Check back soon to see the Bindra Knowledge Hub community in action."
      action={buildAction(action ?? { label: "Back to home", href: "/" })}
    />
  );
}

export function NoResultsEmpty({ action }: { action?: EmptyAction }) {
  return (
    <EmptyState
      icon={<FileQuestion aria-hidden="true" className="size-8" />}
      title="No results found"
      description="We couldn't find any records matching your selection. Try adjusting the filters or explore our other programmes."
      action={buildAction(action ?? { label: "View all courses", href: "/courses" })}
    />
  );
}

export function NoTestimonialsEmpty({ action }: { action?: EmptyAction }) {
  return (
    <EmptyState
      icon={<MessageSquareHeart aria-hidden="true" className="size-8" />}
      title="Stories coming soon"
      description="Families are sharing how Bindra Knowledge Hub has shaped their journeys. Their voices will appear here shortly."
      action={buildAction(action ?? { label: "Talk to us", href: "/contact" })}
    />
  );
}

export function NoSearchResultsEmpty({
  query,
  action,
}: {
  query?: string;
  action?: EmptyAction;
}) {
  const resolvedAction =
    action ??
    ({ label: "Browse the site", href: "/" } as EmptyAction);

  return (
    <EmptyState
      icon={<SearchX aria-hidden="true" className="size-8" />}
      title={query ? `No matches for “${query}”` : "No search results"}
      description="We couldn't find anything for that search. Double-check the spelling or try a different keyword."
      action={buildAction(resolvedAction)}
    />
  );
}
