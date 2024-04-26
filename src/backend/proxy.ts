import { Client, getOnBehalfOfAccessToken } from '@navikt/familie-backend';
import { logError, logWarn } from '@navikt/familie-logging';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest, IncomingMessage, ServerResponse } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
import { oboConfig } from './config.js';
import { IService } from './serviceConfig.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const restream = (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse) => {
    const requestBody = (req as Request).body;
    if (requestBody) {
        const bodyData = JSON.stringify(requestBody);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
};

export const doProxy = (service: IService) => {
    return createProxyMiddleware({
        changeOrigin: true,
        on: {
            proxyReq: restream,
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pathRewrite: (path: string, _req: Request) => {
            return `/api${path}`;
        },
        secure: true,
        target: `${service.proxyUrl}`,
    });
};

export const attachToken = (authClient: Client, service: IService) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        getOnBehalfOfAccessToken(authClient, req, oboConfig(service))
            .then((accessToken: string) => {
                req.headers['Nav-Call-Id'] = uuidv4();
                req.headers.Authorization = `Bearer ${accessToken}`;
                return next();
            })
            .catch((e) => {
                if (e.error === 'invalid_grant') {
                    logWarn(`invalid_grant`);
                    _res.status(500).json({
                        status: 'IKKE_TILGANG',
                        frontendFeilmelding:
                            'Uventet feil. Det er mulig at du ikke har tilgang til applikasjonen.',
                    });
                } else {
                    logError(`Uventet feil - getOnBehalfOfAccessToken`, e);
                    _res.status(500).json({
                        status: 'FEILET',
                        frontendFeilmelding: 'Uventet feil. Vennligst prøv på nytt.',
                    });
                }
            });
    };
};
