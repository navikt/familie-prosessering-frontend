const app = require('./mock-routes');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../.nais/webpack/webpack.dev').default;
const path = require('path');

const port = 8000;

// @ts-ignore
const compiler = webpack(config);
const middleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('/{*splat}', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
        middleware.context.outputFileSystem.readFileSync(
            path.join(process.cwd(), 'frontend_development/index.html')
        )
    );
    res.end();
});

const server = app.listen(port, 'localhost', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('=== mock-server startet på http://localhost:%s/', port);
});

process.on('SIGTERM', function() {
    server.close();
});
