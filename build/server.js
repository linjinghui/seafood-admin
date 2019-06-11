'use strict';
const path = require('path');
const express = require('express');
const webpack = require('webpack');
var proxy = require('http-proxy-middleware');
const webpackConfig = require('../config/webpack.dev');
const config = require('../config/config');
const childProcess = require('child_process');

const app = express();

webpackConfig.entry.client = [
  'webpack-hot-middleware/client',
  webpackConfig.entry.client
];

const compiler = webpack(webpackConfig);

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
});

app.use(devMiddleWare);
app.use(require('webpack-hot-middleware')(compiler));

app.get('/', (req, res) => {
  const fs = devMiddleWare.fileSystem;

  devMiddleWare.waitUntilValid(() => {

    const html = fs.readFileSync(path.join(webpackConfig.output.path, './index.html'));

    res.end(html);
  });
});

// 代理开始
app.use('/api', proxy('/api', {
  target: 'http://127.0.0.1:5004',
  changeOrigoin: true
}));

app.listen(config.port, () => {
  // console.log(`Listening at http://localhost:${config.port}`)
  var url = 'http://localhost:' + config.port;
  if (/^win/.test(process.platform)){
    childProcess.exec('start ' + url);
  }else{
    childProcess.exec('open ' + url);
  }
});
