const _ = require("lodash");
const path = require("path");

module.exports = function({ method, program, ...defaults }) {
    const opts = {
        // 自定义配置
        resolve: {
            alias: {
                "@": path.join(__dirname, "."),
                components: path.join(__dirname, "../demo/components")
            }
        },
        loaders: {
            scss: true
        }
    };

    return _.defaultsDeep(opts, defaults);
};
