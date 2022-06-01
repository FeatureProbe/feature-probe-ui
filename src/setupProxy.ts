import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app: any) {
  app.use(
    '/api/server/events',
    createProxyMiddleware({
      target: 'http://localhost:4007/api/server/events',
      changeOrigin: false,
      cookiePathRewrite: false,
    })
  );
};