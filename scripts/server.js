const packez = require("packez");
const path = require("path");

packez.server("./demo/index.js", "dist", {
    publicPath: "/",
    assest: {
        css: {
            output: "css"
        },
        js: {
            output: "js"
        },
        media: {
            output: "media",
            publicPath: "/media"
        }
    },
    resolve: {
        alias: {
            "@": path.join(__dirname, ".."),
            components: path.join(__dirname, "../demo/components")
        }
    },
    loaders: {
        scss: true,
        eslint: {
            rules: {
                "react/jsx-no-undef": 1
            }
        },
        babel: {}
    }
});
