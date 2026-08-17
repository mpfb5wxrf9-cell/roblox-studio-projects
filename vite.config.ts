import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Repository name on GitHub — GitHub Pages serves project sites from
// https://<user>.github.io/<repo>/, so every asset URL needs this prefix.
// Change it if the repo is renamed, and update the "homepage"-style URL in README.md too.
const REPO_NAME = 'roblox-studio-projects'

// https://vite.dev/config/
export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
})
