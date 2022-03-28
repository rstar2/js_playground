const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";

// Logging
app.use(morgan("dev"));

// Info GET endpoint
app.get("/info", (req, res, next) => {
  res.send(
    "This is a proxy service which proxies to Billing and Account APIs."
  );
});

// // Authorization
// app.use((req, res, next) => {
//   if (req.headers.authorization) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// });

// // Proxy some endpoints to specific host
// // so requests to this server like http://localhost:3000/json_placeholder/todos/1
// // will be proxied (and path-rewritten) to http://jsonplaceholder.typicode.com/todos/1
// app.use(
//   "/json_placeholder",
//   createProxyMiddleware({
//     target: API_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^/json_placeholder`]: "",
//     },
//   })
// );

app.use((req, res, next) => {
  const proxy = createProxyMiddleware({
    target: req.url,
    changeOrigin: true,
  });

  proxy(req, res, next);
});

// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});