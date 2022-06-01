import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function(app: any) {
  app.use(
    '/server',
    createProxyMiddleware({
      target: window.location.protocol + '//' + window.location.hostname + ':4007/',
      changeOrigin: false,
      cookiePathRewrite: false,
    })
  );
};