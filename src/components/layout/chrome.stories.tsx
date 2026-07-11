import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const meta = {
  title: "Chrome/Navigation",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Global chrome: Navbar (desktop + mobile, sticky, transparent→solid on scroll, keyboard + ARIA) and Footer (newsletter, quick links, social, contact, copyright). These are the persistent shells rendered by the root layout.",
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SiteChrome: Story = {
  render: () => (
    <div className="min-h-[120vh] bg-background">
      <Navbar />
      <main className="px-6 pt-24">
        <p className="text-body text-muted-foreground">Page content area (scroll to see nav turn solid).</p>
      </main>
      <Footer />
    </div>
  ),
  name: "Navbar + Footer",
  parameters: { layout: "fullscreen" },
};
