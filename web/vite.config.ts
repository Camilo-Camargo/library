import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  const env = process.env.ENV;
  if (env === "dev") {
    process.env = loadEnv(mode, path.resolve(process.cwd(), "../"));
  }
  return defineConfig({
    plugins: [react()],
  })
}

