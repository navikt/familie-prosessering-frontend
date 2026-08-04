import { Client, ensureAuthenticated } from '@navikt/familie-backend';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { buildPath } from './config.js';
import { IService } from './serviceConfig.js';
import WebpackDevMiddleware from 'webpack-dev-middleware';

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

export default (
    authClient: Client,
    router: Router,
    servicer: IService[],
    middleware?: WebpackDevMiddleware.API<Request, Response>
) => {
    router.get('/version', (req, res) => {
        res.status(200).send({ version: process.env.APP_VERSION }).end();
    });

    // SERVICES
    router.get('/services', (req, res) => {
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

    // APP
    if (process.env.NODE_ENV === 'development' && middleware) {
        router.get(
            '*global',
            ensureAuthenticated(authClient, false),
            (req: Request, res: Response) => {
                if (middleware.context.outputFileSystem.readFileSync) {
                    const html = middleware.context.outputFileSystem
                        .readFileSync(
                            path.resolve(middleware.context.compiler.outputPath, `index.html`)
                        )
                        .toString();
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(injectMetaTags(html));
                    res.end();
                }
            }
        );
    } else {
        router.get(
            '*global',
            ensureAuthenticated(authClient, false),
            (req: Request, res: Response) => {
                const filePath = path.resolve(process.cwd(), buildPath, 'index.html');
                const html = fs.readFileSync(filePath, 'utf-8');
                res.setHeader('Content-Type', 'text/html');
                res.send(injectMetaTags(html));
            }
        );
    }

    return router;
};
