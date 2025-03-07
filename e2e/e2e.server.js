const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("../webpack.dev.js");

const compiler = webpack(config);
const server = new WebpackDevServer({ port: 9000 }, compiler);

server
    .start()
    .then(() => {
        if (process.send) {
            process.send("ok");
        }
    })
    .catch((err) => {
        console.error("Ошибка запуска сервера:", err);
    });
