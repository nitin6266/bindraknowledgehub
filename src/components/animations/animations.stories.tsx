import type { Meta, StoryObj } from "@storybook/react-vite";
import { FadeUp, ScaleIn, SlideIn, Stagger, StaggerItem, HoverLift } from "@/components/animations/motion-primitives";

const meta = {
  title: "Animations/Presets",
  component: FadeUp,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Reusable, subtle motion presets (FadeIn, FadeUp, ScaleIn, SlideIn, Stagger + StaggerItem, HoverLift). All honor prefers-reduced-motion. No excessive movement — entrances only.",
      },
    },
  },
} satisfies Meta<typeof FadeUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Presets: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <FadeUp>
        <div className="rounded-lg bg-primary/10 p-6 text-primary">FadeUp on scroll</div>
      </FadeUp>
      <ScaleIn>
        <div className="rounded-lg bg-accent/15 p-6 text-accent-foreground">ScaleIn</div>
      </ScaleIn>
      <SlideIn direction="left">
        <div className="rounded-lg bg-muted p-6">SlideIn from left</div>
      </SlideIn>
      <Stagger className="flex gap-4">
        {[1, 2, 3].map((n) => (
          <StaggerItem key={n}>
            <HoverLift>
              <div className="rounded-lg bg-surface p-6 shadow-sm">Card {n}</div>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  ),
  name: "Presets",
};
