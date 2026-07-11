import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/utility/animated-counter";
import { SectionHeader } from "@/components/utility/section-header";
import { CtaBanner } from "@/components/utility/cta-banner";
import { Callout } from "@/components/utility/callout";
import { HighlightText } from "@/components/utility/highlight-text";
import { GlassCard } from "@/components/utility/glass-card";

const meta = {
  title: "Utility/Primitives",
  component: SectionHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Composed utilities: AnimatedCounter (count-up, reduced-motion aware), SectionHeader (eyebrow+title+subtitle), CtaBanner, Callout, HighlightText (inline emphasis), GlassCard (frosted surface).",
      },
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Utilities: Story = {
  args: { title: "Utilities" },
  render: () => (
    <div className="flex w-[40rem] flex-col gap-8 p-6">
      <SectionHeader eyebrow="Why us" title="Trusted by families" description="A warm, premium learning environment." />
      <p className="text-body-lg">
        We help students build <HighlightText>confidence</HighlightText> and <HighlightText variant="primary">clarity</HighlightText>.
      </p>
      <div className="font-heading text-display-md font-bold text-primary">
        <AnimatedCounter value={1200} suffix="+" />
      </div>
      <Callout variant="info" title="Note">
        Admissions for the new batch open soon.
      </Callout>
      <GlassCard className="p-6">Frosted glass surface for overlays.</GlassCard>
      <CtaBanner title="Begin your journey" description="Talk to our counsellors today." action={<Button>Enquire</Button>} />
    </div>
  ),
  name: "Showcase",
};
