import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "@/components/ui/banner";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Feedback/Primitives",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Feedback primitives: Spinner (role=status, label), Skeleton (loading placeholder), Banner (success/error/warning/info with optional dismiss), EmptyState (friendly no-data placeholder). All announce state to assistive tech.",
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeedbackShowcase: Story = {
  render: () => (
    <div className="flex w-[28rem] flex-col gap-6">
      <div className="flex items-center gap-3 text-primary">
        <Spinner /> <span className="text-body-sm">Loading…</span>
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Banner variant="success" title="Enquiry sent" description="We will reach out within 24 hours." />
      <Banner variant="error" title="Something went wrong" description="Please try again." onDismiss={() => {}} />
      <EmptyState title="No results yet" description="Results will appear here after exams." action={<Button size="sm">Notify me</Button>} />
    </div>
  ),
  name: "Showcase",
};
