import { Client, appConfig, getOnBehalfOfAccessToken, IApi } from '@navikt/familie-backend';
import { NextFunction, Request, Response } from 'express';
import { ClientRequest } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { v4 as uuidv4 } from 'uuid';
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
    return createProxyMiddleware(service.proxyPath, {
        changeOrigin: true,
        logLevel: 'info',
        onProxyReq: restream,
        pathRewrite: (path: string, _req: Request) => {
            const newPath = path.replace(service.proxyPath, '');
            return `/api${newPath}`;
        },
        secure: true,
        target: `${service.proxyUrl}`,
    });
};

export const attachToken = (authClient: Client, service: IService) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const oboConfig: IApi = {
            clientId: appConfig.clientId,
            scopes: [service.azureScope],
        };
        getOnBehalfOfAccessToken(authClient, req, oboConfig).then((accessToken: string) => {
            req.headers['Nav-Call-Id'] = uuidv4();
            req.headers.Authorization = `Bearer ${accessToken}`;
            return next();
        });
    };
};
