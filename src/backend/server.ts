import './azureConfig.js';
import backend, { ensureAuthenticated, IApp } from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import express from 'express';
import loglevel from 'loglevel';
import moment from 'moment';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { attachToken, doProxy } from './proxy.js';
import setupRouter from './router.js';
import { IService, serviceConfig } from './serviceConfig.js';
import { sessionConfig } from './config.js';

// @ts-expect-error spesialimport
import config from '../.nais/webpack/webpack.dev.js';
import { teamconfig } from './teamconfig';

loglevel.setDefaultLevel(loglevel.levels.INFO);

const port = 8000;

backend(sessionConfig).then(({ app, azureAuthClient, router }: IApp) => {
    let middleware;

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);

        if (!compiler) {
            throw new Error('Webpack compiler kunne ikke opprettes, mangler verdi.');
        }

        middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
    } else {
        app.use('/assets', express.static(path.resolve(process.cwd(), 'frontend_production/')));
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

    // Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
    app.use(bodyParser.json({ limit: '200mb' }));
    app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
    app.use('/', setupRouter(azureAuthClient, router, servicer, middleware));

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
