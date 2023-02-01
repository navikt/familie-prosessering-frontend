import path from 'path';
import webpack from 'webpack';
import { mergeWithCustomize } from 'webpack-merge';
import common from './webpack.common';

const config = mergeWithCustomize({
    'entry.familie-prosessering': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'development',
    entry: {
        'familie-prosessering': [
            'babel-polyfill',
            'react-hot-loader/patch',
            'webpack-hot-middleware/client?reload=true',
        ],
    },
    output: {
        path: path.resolve(process.cwd(), 'frontend_development/'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
        globalObject: 'this',
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            // would only land a "hot-patch" to react-dom
            {
                test: /\.(js|ts)$/,
                include: /node_modules\/react-dom/,
                use: ['react-hot-loader/webpack'],
            },
        ],
    },
});

export default config;
