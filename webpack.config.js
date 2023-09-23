const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: ["./src/index.ts"],

    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
    },

    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".js"],
    },

    plugins: [
        new htmlWebpackPlugin({
            title: "Ceros Ski",
            template: "src/index.html",
        }),
        new CopyPlugin({
            patterns: [{ from: "img/*", to: "" }],
        }),
    ],

    // Add the following configuration to resolve module aliases used by Jest
    resolve: {
        alias: {
            "^@/(.*)$": "<rootDir>/src/$1",
        },
    },
};
