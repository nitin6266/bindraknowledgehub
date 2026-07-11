import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Grid } from "@/components/layout/grid";
import { Stack } from "@/components/layout/stack";
import { Divider } from "@/components/layout/divider";
import { Surface } from "@/components/layout/surface";
import { HeroWrapper } from "@/components/layout/hero-wrapper";

const meta = {
  title: "Layout/Primitives",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Structural primitives: Container (max-width), Section (vertical rhythm), Grid (responsive cols), Stack (flex gap), Divider (separator), Surface (elevated panel), HeroWrapper (hero region). All mobile-first.",
      },
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutShowcase: Story = {
  render: () => (
    <div className="w-full">
      <HeroWrapper muted>
        <h1 className="font-heading text-display-md font-bold">Hero region</h1>
      </HeroWrapper>
      <Section>
        <Container>
          <Grid cols={3}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Surface key={n} className="p-6 text-center">
                Item {n}
              </Surface>
            ))}
          </Grid>
          <Divider label="or" className="my-8" />
          <Stack gap="md">
            <Surface className="p-4">Stacked item A</Surface>
            <Surface className="p-4">Stacked item B</Surface>
          </Stack>
        </Container>
      </Section>
    </div>
  ),
  name: "Showcase",
  parameters: { layout: "fullscreen" },
};
