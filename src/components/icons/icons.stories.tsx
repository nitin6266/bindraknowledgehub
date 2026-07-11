import type { Meta, StoryObj } from "@storybook/react-vite";
import { BookOpen, Sparkles } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { FeatureIcon } from "@/components/icons/feature-icon";
import { AnimatedIconContainer } from "@/components/icons/animated-icon-container";

const meta = {
  title: "Icons/Primitives",
  component: IconWrapper,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "IconWrapper standardizes icon sizing/tinting. FeatureIcon adds brand emphasis (optional ring). AnimatedIconContainer lifts on hover and respects reduced-motion. Always pass an accessible label or aria-hidden for decorative icons.",
      },
    },
  },
} satisfies Meta<typeof IconWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Icons: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <IconWrapper size="sm" variant="primary">
        <BookOpen className="size-4" />
      </IconWrapper>
      <IconWrapper size="md" variant="accent">
        <Sparkles className="size-5" />
      </IconWrapper>
      <FeatureIcon size="lg" icon={BookOpen} />
      <AnimatedIconContainer>
        <FeatureIcon size="lg" icon={Sparkles} ring />
      </AnimatedIconContainer>
    </div>
  ),
  name: "Icon Set",
};
