import path from "path";
import webpack from "webpack";
import common from './webpack.common.js';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserPlugin from "terser-webpack-plugin";
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import { mergeWithCustomize } from "webpack-merge";

const config = mergeWithCustomize({
    'entry.familie-ks-mottak': 'prepend',
    'module.rules': 'append',
})(common, {
    mode: 'production',
    entry: {
        'familie-ks-mottak': ['babel-polyfill'],
    },
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
});

export default config
