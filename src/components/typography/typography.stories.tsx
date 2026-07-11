import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "@/components/ui/heading";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";
import { Quote } from "@/components/typography/quote";
import { Label } from "@/components/typography/label";
import { Caption } from "@/components/typography/caption";

const meta = {
  title: "Typography/Primitives",
  component: Heading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Typography primitives built on the fluid type scale. Heading pairs a semantic tag with size/tone/align; Subheading is the lead; Paragraph supports sm/base/lg; Quote is an editorial blockquote; Label is an uppercase form/section label; Caption is small supporting text.",
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-4 text-left">
      <Heading as="h1" size="display">
        Display heading
      </Heading>
      <Heading as="h2" size="xl">
        H1 / XL heading
      </Heading>
      <Heading as="h3" size="lg">
        H2 / Large heading
      </Heading>
      <Subheading>Subheading lead text that supports the heading above.</Subheading>
      <Paragraph>
        Body paragraph with normal size and comfortable line-height for long-form reading.
      </Paragraph>
      <Label htmlFor="demo">Course name</Label>
      <Caption>Results published after the final term examination.</Caption>
      <Quote author="A parent">Bindra Knowledge Hub gave our child confidence and clarity.</Quote>
    </div>
  ),
  name: "Type Scale",
};

export const Labels: StoryObj<typeof Label> = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label htmlFor="name">Full name</Label>
      <Label size="md" tone="primary">Primary label</Label>
      <Label size="lg" tone="accent">Accent label</Label>
      <Label>Presentational label (span)</Label>
    </div>
  ),
  name: "Label",
  parameters: {
    docs: {
      description: {
        component:
          "Uppercase, tracked label. Renders a real <label> when `htmlFor` is provided; otherwise a presentational <span>.",
      },
    },
  },
};

export const Captions: StoryObj<typeof Caption> = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Caption>Default muted caption — supporting metadata.</Caption>
      <Caption tone="default">Foreground caption.</Caption>
      <Caption tone="primary">Primary caption.</Caption>
      <Caption align="center">Centered caption text.</Caption>
    </div>
  ),
  name: "Caption",
  parameters: {
    docs: {
      description: {
        component: "Small supporting text for metadata, footnotes and image credits.",
      },
    },
  },
};
