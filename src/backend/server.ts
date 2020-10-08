import './azureConfig';
import backend, { IApp, ensureAuthenticated, getLogTimestamp } from '@navikt/familie-backend';
import bodyParser from 'body-parser';
import express from 'express';
import loglevel from 'loglevel';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { attachToken, doProxy } from './proxy';
import setupRouter from './router';
import { IService, serviceConfig } from './serviceConfig';
import { sessionConfig } from './config';

/* tslint:disable */
const config = require('../build_n_deploy/webpack/webpack.dev');
/* tslint:enable */

loglevel.setDefaultLevel(loglevel.levels.INFO);

const port = 8000;

backend(sessionConfig).then(({ app, azureAuthClient, router }: IApp) => {
    let middleware;

    if (process.env.NODE_ENV === 'development') {
        const compiler = webpack(config);
        middleware = webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
    } else {
        app.use('/assets', express.static(path.join(__dirname, '..', 'frontend_production')));
    }

    serviceConfig.map((service: IService) => {
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
    app.use('/', setupRouter(azureAuthClient, router, middleware));

    app.listen(port, '0.0.0.0', () => {
        loglevel.info(
            `${getLogTimestamp()}: server startet på port ${port}. Build version: ${
                process.env.APP_VERSION
            }.`
        );
    }).on('error', (err) => {
        loglevel.error(`${getLogTimestamp()}: server startup failed - ${err}`);
    });
});
