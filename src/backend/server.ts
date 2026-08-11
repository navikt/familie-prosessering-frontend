import './azureConfig.js';
import type { IApp } from '@navikt/familie-backend';
import backend, { ensureAuthenticated } from '@navikt/familie-backend';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import loglevel from 'loglevel';
import moment from 'moment';
import path from 'path';
import { logInfo } from '@navikt/familie-logging';
import { attachToken, doProxy } from './proxy.js';
import setupRouter from './router.js';
import type { IService } from './serviceConfig.js';
import { serviceConfig } from './serviceConfig.js';
import { frontendPath, sessionConfig } from './config.js';
import { erLokal } from './env.js';
import { teamconfig } from './teamconfig.js';

loglevel.setDefaultLevel(loglevel.levels.INFO);

const port = 8000;

backend(sessionConfig).then(async ({ app, azureAuthClient, router }: IApp) => {
    if (!erLokal()) {
        app.use('/assets', express.static(path.join(process.cwd(), frontendPath, 'assets')));
        app.use(
            '/favicon.ico',
            express.static(path.join(process.cwd(), frontendPath, 'favicon.ico'))
        );
    }

    const servicer = serviceConfig[teamconfig.team];

    servicer.map((service: IService) => {
        app.use(
            service.proxyPath,
            ensureAuthenticated(azureAuthClient, true),
            attachToken(azureAuthClient, service),
            doProxy(service)
        );
    });

    // Sett opp parsing av request body og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset
    app.use(express.json({ limit: '200mb' }));
    app.use(express.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', await setupRouter(azureAuthClient, router, servicer));

    // Error-handling middleware - må registreres etter alle andre routes
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        if (res.headersSent) {
            return _next(err);
        }
        if (
            err.message?.includes('did not find expected authorization request details in session')
        ) {
            logInfo(
                `OIDC-sesjon mangler ved callback - brukeren omdirigeres til login. Detaljer: ${err.message}`
            );
            res.redirect('/login');
        } else {
            loglevel.error(`Uhåndtert feil: ${err.message}`);
            res.status(500).send('Intern feil');
        }
    });

    app.listen(port, '0.0.0.0', () => {
        loglevel.info(
            `${moment().toISOString(true)}: server startet på port ${port}. Build version: ${
                process.env.APP_VERSION
            }.`
        );
    }).on('error', (err) => {
        loglevel.error(`${moment().toISOString(true)}: server startup failed - ${err}`);
    });
});
