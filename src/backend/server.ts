import dotenv from 'dotenv';
dotenv.config();

import Backend from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import loglevel from 'loglevel';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { attachToken, doProxy } from './proxy';
import setupRouter from './router';
import { IService, serviceConfig } from './serviceConfig';

import { passportConfig, saksbehandlerTokenConfig, sessionConfig } from './config';

/* tslint:disable */
const config = require('../build_n_deploy/webpack/webpack.dev');
/* tslint:enable */

loglevel.setDefaultLevel(loglevel.levels.INFO);
const backend = new Backend(passportConfig, sessionConfig, saksbehandlerTokenConfig);

backend.getApp().use(helmet());

const port = 8000;

let middleware;

if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(config);
    middleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    });

    backend.getApp().use(middleware);
    backend.getApp().use(webpackHotMiddleware(compiler));
} else {
    backend
        .getApp()
        .use('/assets', express.static(path.join(__dirname, '..', 'frontend_production')));
}

serviceConfig.map((service: IService) => {
    backend
        .getApp()
        .use(
            service.proxyPath,
            backend.ensureAuthenticated(true, saksbehandlerTokenConfig),
            attachToken(service, backend),
            doProxy(service)
        );
});

// Sett opp bodyParser og router etter proxy. Spesielt viktig med tanke på større payloads som blir parset av bodyParser
backend.getApp().use(bodyParser.json({ limit: '200mb' }));
backend.getApp().use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
backend.getApp().use('/', setupRouter(backend, middleware));

backend.getApp().listen(port, '0.0.0.0', (err: Error) => {
    if (err) {
        loglevel.error(`${backend.getLogTimestamp()}: server startup failed - ${err}`);
    }
    loglevel.info(
        `${backend.getLogTimestamp()}: server startet på port ${port}. Build version: ${
            process.env.APP_VERSION
        }.`
    );
});
