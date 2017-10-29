const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev');
const { SERVER_CONFIG } = require('./server/constants');

const port = SERVER_CONFIG.PORT_DEVELOPMENT;
const app = express();
const compiler = webpack(config);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', '.');

// app.use('/htmls', express.static(SERVER_CONFIG.ASSETS_FOLDER_DEVELOPMENT + '/htmls'));
// app.use('/PDF', express.static(SERVER_CONFIG.ASSETS_FOLDER_DEVELOPMENT + '/PDF'));
// app.use('/fonts', express.static(SERVER_CONFIG.ASSETS_FOLDER_DEVELOPMENT + '/fonts'));

const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: 'app',
  headers: { 'Access-Control-Allow-Origin': '*' },
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
});

app.use(middleware);
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});
app.use(webpackHotMiddleware(compiler));
app.get('*', (req, res) => {
  res.render('index', {
    og: false,
    url: `${req.protocol}://${req.get('host')}`,
  });
  res.end();
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
