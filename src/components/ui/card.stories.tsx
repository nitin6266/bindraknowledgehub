import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Composable surface primitive (header/title/description/content/footer). Foundation for all domain cards.",
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description text goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body-sm text-muted-foreground">Body content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};
