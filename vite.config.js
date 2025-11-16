import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'react-sudoku';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: `/${repoName}/`,
  server: {
    host: '127.0.0.1', // Explicitly bind to the loopback address
    port: 8080,
  },
})
