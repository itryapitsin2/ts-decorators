module.exports = {
    presets: [
        "@babel/env",
        "@babel/typescript"
    ],
    plugins: [
        // "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", {legacy: true }],
        ["@babel/plugin-proposal-class-properties", { loose: true }]
    ],
};
