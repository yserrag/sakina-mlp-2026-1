import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [ANALYSIS] 
// We removed the manual 'define' block. 
// Now, Vite will automatically pull 'VITE_GOOGLE_API_KEY' 
// from Cloudflare's system environment variables.
export default defineConfig({
  plugins: [react()],
});