import type { Client } from '@navikt/familie-backend';
import { ensureAuthenticated } from '@navikt/familie-backend';
import type { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import type { ViteDevServer } from 'vite';
import { frontendPath } from './config.js';
import { erLokal } from './env.js';
import type { IService } from './serviceConfig.js';

const naisMetaTags = (): string => {
    const app = process.env.NAIS_APP_NAME ?? '';
    const team = process.env.NAIS_NAMESPACE ?? process.env.NAIS_TEAM ?? '';
    const cluster = process.env.NAIS_CLUSTER_NAME ?? '';
    const telemetryUrl = process.env.NAIS_TELEMETRY_URL ?? '';
    if (!app && !team) return '';
    return [
        app ? `<meta name="nais-app" content="${app}">` : '',
        team ? `<meta name="nais-team" content="${team}">` : '',
        cluster ? `<meta name="nais-cluster" content="${cluster}">` : '',
        telemetryUrl ? `<meta name="nais-telemetry-url" content="${telemetryUrl}">` : '',
    ]
        .filter(Boolean)
        .join('\n    ');
};

export default async (authClient: Client, router: Router, servicer: IService[]) => {
    router.get('/version', (_req, res) => {
        res.status(200).send({ version: process.env.APP_VERSION }).end();
    });

    // SERVICES
    router.get('/services', (_req, res) => {
        res.status(200)
            .send({
                data: servicer.map((service: IService) => {
                    return {
                        displayName: service.displayName,
                        id: service.id,
                        gruppe: service.gruppe,
                        proxyPath: service.proxyPath,
                    };
                }),
                status: 'SUKSESS',
            })
            .end();
    });

    const injectMetaTags = (html: string): string => {
        const tags = naisMetaTags();
        if (!tags) return html;
        return html.replace('<head>', `<head>\n    ${tags}`);
    };

    let viteDevServer: ViteDevServer | undefined = undefined;
    if (erLokal()) {
        const { createServer } = await import('vite');
        viteDevServer = await createServer({
            root: path.join(process.cwd(), frontendPath),
            server: { middlewareMode: true },
            appType: 'custom',
        });

        router.use(viteDevServer.middlewares);
    }

    const htmlPath = path.join(process.cwd(), frontendPath, 'index.html');
    let htmlInnholdProd: string | undefined;

    // APP
    router.get(
        '*splat',
        ensureAuthenticated(authClient, false),
        async (req: Request, res: Response) => {
            if (erLokal()) {
                if (!viteDevServer) {
                    throw new Error('ViteDevServer er ikke initialisert.');
                }
                const htmlInnhold = await fs.promises.readFile(htmlPath, 'utf-8');
                const transformed = await viteDevServer.transformIndexHtml(req.url, htmlInnhold);
                res.status(200).type('html').send(injectMetaTags(transformed));
            } else {
                if (!htmlInnholdProd) {
                    htmlInnholdProd = injectMetaTags(await fs.promises.readFile(htmlPath, 'utf-8'));
                }
                res.status(200).type('html').send(htmlInnholdProd);
            }
        }
    );

    return router;
};
