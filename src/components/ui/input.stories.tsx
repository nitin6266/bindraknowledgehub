import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";

const meta = {
  title: "Forms/Inputs",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Accessible form controls. All use semantic native elements (input/select/textarea) or role-based switches, with visible focus rings and aria-invalid styling. Labels are required for a11y.",
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Input placeholder="Full name" aria-label="Full name" />
      <Input placeholder="Email" type="email" aria-invalid aria-label="Email" />
      <Textarea placeholder="Your message" aria-label="Message" />
      <Select aria-label="Course" defaultValue="">
        <option value="" disabled>
          Select course
        </option>
        <option>Mathematics</option>
        <option>Science</option>
      </Select>
    </div>
  ),
};

export const ChoiceControls: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Checkbox label="I agree to the terms" defaultChecked />
      <Checkbox label="Subscribe to newsletter" />
      <Radio name="grade" label="Grade 10" defaultChecked />
      <Radio name="grade" label="Grade 11" />
      <div className="flex items-center justify-between">
        <span className="text-body-sm">Enable notifications</span>
        <Switch aria-label="Enable notifications" defaultChecked />
      </div>
      <FileUpload hint="PDF or image, up to 5MB" />
    </div>
  ),
  name: "Choice Controls",
  parameters: { docs: { description: { component: "Checkbox, Radio, Switch and FileUpload." } } },
};

export const InvalidState: Story = {
  render: () => <Input aria-invalid placeholder="Required field" aria-label="Required" className="w-80" />,
  name: "Invalid State",
};
