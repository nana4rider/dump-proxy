const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// リクエスト内容をダンプするミドルウェア
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body); // もしリクエストにボディが含まれている場合
  console.log('------------------------');
  next();
});

// 必要なヘッダーをセットしてプロキシ
app.use(
  '/',
  createProxyMiddleware({
    target: process.env.PROXY_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // 必要なヘッダーを追加
      proxyReq.setHeader('X-Real-IP', req.connection.remoteAddress);
      proxyReq.setHeader('X-Forwarded-For', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
      proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
      proxyReq.setHeader('Authorization', req.headers['authorization'] || ''); // Authorization ヘッダも追加
    },
    onProxyRes: (proxyRes, req, res) => {
      // プロキシ先からのレスポンスヘッダーを表示する
      console.log('--- Proxy Response ---');
      console.log('Status:', proxyRes.statusCode);
      console.log('Headers:', proxyRes.headers);
      console.log('------------------------');
    }
  })
);

const port = Number(process.env.PORT || '5000');
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
