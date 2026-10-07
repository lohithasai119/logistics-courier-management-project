// Starts the fake backend (json-server on :3000) and the React app (Vite) together.
// Usage:  npm run dev:all
import { spawn } from "node:child_process";

const run = (name, cmd) => {
  const p = spawn(cmd, { shell: true, stdio: "inherit" });
  p.on("exit", (code) => { console.log(`[${name}] stopped (${code})`); process.exit(code ?? 0); });
  return p;
};

run("api", "npx json-server --watch db.json --port 3000");
run("web", "npx vite");
