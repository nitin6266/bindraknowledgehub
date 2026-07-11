import type { Meta, StoryObj } from "@storybook/react-vite";
import { Star, BookOpen } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { useState } from "react";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact, optionally interactive chip for filters, tags and selections. Supports a leading icon and an optional dismiss (×) control. Distinct from the static Pill via its interactivity and icon slot. All visuals come from design tokens; the dismiss button is keyboard reachable with an aria-label.",
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip>Default</Chip>
      <Chip variant="accent" icon={<Star />}>Top rated</Chip>
      <Chip variant="outline" icon={<BookOpen />}>Course</Chip>
      <Chip variant="success">Enrolled</Chip>
      <Chip variant="warning">Pending</Chip>
      <Chip variant="danger">Closed</Chip>
    </div>
  ),
  name: "Variants",
};

function DismissibleChips() {
  const [chips, setChips] = useState(["Mathematics", "Physics", "Chemistry"]);
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <Chip
          key={c}
          variant="accent"
          onDismiss={() => setChips((prev) => prev.filter((x) => x !== c))}
          dismissLabel={`Remove ${c}`}
        >
          {c}
        </Chip>
      ))}
    </div>
  );
}

export const Dismissible: Story = {
  render: () => <DismissibleChips />,
  name: "Dismissible",
  parameters: {
    docs: {
      description: {
        component: "Set `onDismiss` + `dismissLabel` to render an accessible remove button.",
      },
    },
  },
};

export const Selected: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip variant="default" selected>Selected filter</Chip>
      <Chip variant="outline">Unselected</Chip>
    </div>
  ),
  name: "Selected state",
};
