const merge = require("webpack-merge");

const path = require("path");
const glob = require("glob");

const parts = require("./webpack.parts");

const PATHS = {
    app: path.join(__dirname, "src")
}

const commonConfig = merge([{
        output: {
            // Needed for code splitting to work in nested paths
            publicPath: "/",
        },
    },
    parts.loadJavaScript({
        include: PATHS.app
    }),
    parts.setFreeVaraible("HELLO", "hello from config"),
]);

const productionConfig = merge([{
        output: {
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js"
        },
        recordsPath: path.join(__dirname, 'records.json'),
        performance: {
            hints: "warning", // "error" or false are valid too
            maxEntrypointSize: 50000, // in bytes, default 250k
            maxAssetSize: 450000, // in bytes
        },
    },
    parts.extractCSS({
        use: ['css-loader', parts.autoprefix()],
    }),
    parts.purifyCSS({
        paths: glob.sync(`${PATHS.app}/**/*.js`, {
            nodir: true
        })
    }),
    parts.loadImages({
        options: {
            limit: 15000,
            name: "[name].[hash:4].[ext]"
        },
    }),
    parts.generateSourceMaps({
        type: "source-map"
    }),
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial",
                    }
                }
            },
            runtimeChunk: {
                name: "manifest",
            },
        },
    },
    parts.clean(),
    parts.attachRevision(),
    parts.minifyJavaScript(),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations
            safe: true,
        },
    }),
]);

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST, // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080
    }),
    parts.loadCSS(),
    parts.loadImages(),
]);

module.exports = mode => {
    process.env.BABEL_ENV = mode;
    const pages = [
        parts.page({
            title: "Webpack demo",
            entry: {
                app: PATHS.app,
            },
        }),
        parts.page({
            title: "Another demo",
            path: "another",
            entry: {
                another: path.join(PATHS.app, "another.js"),
            },
        }),
    ];
    const config = mode === "production" ? productionConfig : developmentConfig;

    return pages.map(page => merge(commonConfig, developmentConfig, page, {
        mode
    }));
};
