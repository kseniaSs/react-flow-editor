import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: "classic" })],
  root: "src",
  base: "./",
  resolve: {
    alias: {
      "@kseniass/react-flow-editor": path.resolve("../../src"),
      "@": path.resolve("../../src")
    }
  },
  build: {
    outDir: "../dist"
  }
})
