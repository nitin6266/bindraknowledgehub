import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { SectionNav } from "@/components/navigation/section-nav";

const meta = {
  title: "Navigation/Primitives",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Breadcrumb: accessible trail (last item = current page via aria-current). SectionNav: in-page anchor navigation with active highlighting. The global Navbar (Desktop + Mobile) and Footer live in components/layout.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NavigationShowcase: Story = {
  args: { items: [] },
  render: () => (
    <div className="flex w-full flex-col gap-8 p-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: "Mathematics" }]} />
      <SectionNav
        items={[
          { label: "Overview", href: "#overview" },
          { label: "Curriculum", href: "#curriculum" },
          { label: "Fees", href: "#fees" },
        ]}
      />
    </div>
  ),
  name: "Showcase",
  parameters: { layout: "fullscreen" },
};
