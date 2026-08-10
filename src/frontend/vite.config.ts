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
            port: 24679,
        },
        port: 8000,
    },
    plugins: [reactPlugin()],
});
