import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/ui/badge";
import { Pill } from "@/components/ui/pill";

const meta = {
  title: "UI/Badge & Pill",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Badge: small status label (default maps to brand primary, plus accent/success/outline). Pill: compact status chip with optional dot. Both are decorative spans; pair with text for meaning.",
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const PillVariants: StoryObj<typeof Pill> = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill variant="neutral">Neutral</Pill>
      <Pill variant="primary" showDot>
        Enrolled
      </Pill>
      <Pill variant="accent" showDot>
        New
      </Pill>
      <Pill variant="success" showDot>
        Passed
      </Pill>
      <Pill variant="warning" showDot>
        Pending
      </Pill>
      <Pill variant="danger" showDot>
        Closed
      </Pill>
    </div>
  ),
  name: "Pill",
  parameters: { docs: { description: { component: "Compact status pill. `showDot` adds a status indicator." } } },
};
