import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: [
      'c152df1738c6.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
});

