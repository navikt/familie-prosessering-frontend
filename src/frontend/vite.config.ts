import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '../../dist_frontend/',
        sourcemap: true,
        emptyOutDir: true,
    },
    define: {
        global: 'window',
    },
    server: {
        hmr: {
            port: 24679, // Ikke default-porten (24678), så HMR ikke kolliderer med andre familie-apper som kjører samtidig
        },
        port: 8000,
    },
    plugins: [reactPlugin()],
});
