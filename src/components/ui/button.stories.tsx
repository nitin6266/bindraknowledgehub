import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Primary action primitive. Variants: primary, secondary, outline, ghost, accent, cta, destructive, link. Keyboard-focusable, visible focus ring, aria-busy when loading. Touch targets >=44px.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "accent", "cta", "destructive", "link"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { children: "Enquire Now" } };
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="cta">CTA</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
export const Loading: Story = { args: { children: "Submitting", loading: true } };
export const WithIcon: Story = {
  render: () => (
    <Button>
      Get Started <ArrowRight className="size-4" />
    </Button>
  ),
};
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };

export const IconButtonStory: StoryObj<typeof IconButton> = {
  args: { "aria-label": "Add item", variant: "solid", size: "md", children: <Plus className="size-5" /> },
  name: "IconButton",
  parameters: { docs: { description: { component: "Square, icon-only button. Requires an accessible aria-label." } } },
};
