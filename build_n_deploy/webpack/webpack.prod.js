import path from 'path';
import webpack from 'webpack';
import common from './webpack.common.js';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import { mergeWithCustomize } from 'webpack-merge';

const config = mergeWithCustomize({
    'entry.familie-prosessering': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'production',
    output: {
        path: path.resolve(process.cwd(), 'frontend_production/'),
        filename: '[name].[contenthash].js',
        publicPath: '/assets/',
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new MiniCssExtractPlugin({
            filename: 'familie-prosessering.css',
        }),
    ],
    optimization: {
        minimizer: [new TerserPlugin(), new CssMinimizerWebpackPlugin()],
        emitOnErrors: false,
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
});

export default config;
