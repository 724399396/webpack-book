exports.devServer = ({
    host,
    port
} = {}) => ({
    stats: "errors-only",
    host: host,
    port: port,
    open: true, // Open the page in browser
    overlay: true
});
