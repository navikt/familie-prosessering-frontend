import Backend from '@navikt/familie-backend';
import { SessionRequest } from '@navikt/familie-backend/lib/typer';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import proxy from 'http-proxy-middleware';
import uuid from 'uuid';
import { oboTokenConfig, saksbehandlerTokenConfig } from './config';
import { IService } from './serviceConfig';

const restream = (proxyReq: ClientRequest, req: Request, res: Response) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (service: IService) => {
    return proxy(service.proxyPath, {
        changeOrigin: true,
        logLevel: 'info',
        onProxyReq: restream,
        pathRewrite: (path, req) => {
            const newPath = path.replace(service.proxyPath, '');
            return `/api${newPath}`;
        },
        secure: true,
        target: `${service.proxyUrl}`,
    });
};

export const attachToken = (service: IService, backend: Backend) => {
    return async (req: SessionRequest, res: Response, next: NextFunction) => {
        const accessToken = await backend
            .validerEllerOppdaterOnBehalfOfToken(req, saksbehandlerTokenConfig, {
                ...oboTokenConfig,
                scope: service.azureScope,
            })
            .catch((error: Error) => {
                backend.logError(req, `Feil ved henting av obo token: ${error.message}`);
                res.status(500).send(`Feil ved autentisering mot baksystem`);
            });
        req.headers['Nav-Call-Id'] = uuid.v1();
        req.headers.Authorization = `Bearer ${accessToken}`;
        return next();
    };
};
