import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'c152df1738c6.ngrok-free.app',
      '2244e984b70a.ngrok-free.app',
      '00403131de6c.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
});

