import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// const API_URL = "https://chitchat1-git-main-sahil352005s-projects.vercel.app";
// fetch(`${API_URL}/api/messages`);
