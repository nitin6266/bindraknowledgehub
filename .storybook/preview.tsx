import type { Preview } from "@storybook/react-vite";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#FFFBF5" },
        { name: "dark", value: "#1C1917" },
      ],
    },
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default preview;
