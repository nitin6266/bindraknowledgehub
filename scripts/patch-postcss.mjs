import { rmSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nestedDir = join(__dirname, "..", "node_modules", "next", "node_modules", "postcss");

if (existsSync(nestedDir)) {
  rmSync(nestedDir, { recursive: true, force: true });
  const topPkg = JSON.parse(
    readFileSync(join(__dirname, "..", "node_modules", "postcss", "package.json"), "utf8")
  );
  console.log(`[postinstall] Patched nested postcss under next → ${topPkg.version}`);
}
