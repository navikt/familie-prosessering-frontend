import { Client, ensureAuthenticated } from '@navikt/familie-backend';
import { Request, Response, Router } from 'express';
import path from 'path';
import { buildPath } from './config';
import { IService, serviceConfig } from './serviceConfig';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import { hentStatistikk } from './statistikk';

export default (
    authClient: Client,
    router: Router,
    middleware?: WebpackDevMiddleware.WebpackDevMiddleware
) => {
    router.get('/version', (req, res) => {
        res.status(200).send({ version: process.env.APP_VERSION }).end();
    });

    // SERVICES
    router.get('/services', (req, res) => {
        res.status(200)
            .send({
                data: serviceConfig.map((service: IService) => {
                    return {
                        displayName: service.displayName,
                        id: service.id,
                        proxyPath: service.proxyPath,
                    };
                }),
                status: 'SUKSESS',
            })
            .end();
    });

    router.get(
        '/statistikk',
        ensureAuthenticated(authClient, false),
        (req: Request, res: Response) => {
            hentStatistikk(req, res);
        }
    );

    // APP
    if (process.env.NODE_ENV === 'development') {
        router.get('*', ensureAuthenticated(authClient, false), (req: Request, res: Response) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(
                middleware.fileSystem.readFileSync(path.join(__dirname, `${buildPath}/index.html`))
            );
            res.end();
        });
    } else {
        router.get('*', ensureAuthenticated(authClient, false), (req: Request, res: Response) => {
            res.sendFile('index.html', { root: path.join(__dirname, buildPath) });
        });
    }

    return router;
};
