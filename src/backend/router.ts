import Backend from '@navikt/familie-backend';
import { Request, Response } from 'express';
import path from 'path';
import { buildPath, saksbehandlerTokenConfig } from './config';
import { IService, serviceConfig } from './serviceConfig';

export default (backend: Backend, middleware: any) => {
    backend.getRouter().get('/version', (req, res) => {
        res.status(200)
            .send({ version: process.env.APP_VERSION })
            .end();
    });

    // SERVICES
    backend.getRouter().get('/services', (req, res) => {
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

    // APP
    if (process.env.NODE_ENV === 'development') {
        backend
            .getRouter()
            .get(
                '*',
                backend.ensureAuthenticated(false, saksbehandlerTokenConfig),
                (req: Request, res: Response) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(
                        middleware.fileSystem.readFileSync(
                            path.join(__dirname, `${buildPath}/index.html`)
                        )
                    );
                    res.end();
                }
            );
    } else {
        backend
            .getRouter()
            .get(
                '*',
                backend.ensureAuthenticated(false, saksbehandlerTokenConfig),
                (req: Request, res: Response) => {
                    res.sendFile('index.html', { root: path.join(__dirname, buildPath) });
                }
            );
    }

    return backend.getRouter();
};
