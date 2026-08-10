import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import app from './mock-routes.js';

const port = 8000;

const frontendRoot = path.join(process.cwd(), 'src/frontend');

const vite = await createServer({
    root: frontendRoot,
    server: { middlewareMode: true },
    appType: 'custom',
});
app.use(vite.middlewares);

// Leses ved oppstart (ikke per request), krever restart ved endring av index.html
const htmlInnhold = await fs.promises.readFile(path.join(frontendRoot, 'index.html'), 'utf-8');

app.get('/{*splat}', async (req, res) => {
    const transformed = await vite.transformIndexHtml(req.originalUrl, htmlInnhold);
    res.status(200).type('html').send(transformed);
});

const server = app.listen(port, 'localhost', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('=== mock-server startet på http://localhost:%s/', port);
});

process.on('SIGTERM', function () {
    server.close();
});
