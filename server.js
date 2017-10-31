var express = require('express');
var axios = require('axios');
// var compression = require('compression');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.prod');
var serverConstants = require('./server/constants');
var SERVER_CONFIG = serverConstants.SERVER_CONFIG;
// server.js
// load the things we need
var development = process.env.NODE_ENV === 'development';
var port = development ? SERVER_CONFIG.PORT_DEVELOPMENT : SERVER_CONFIG.PORT_PRODUCTION;
var app = express();
var compiler = webpack(config);

// set the view engine to ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', '.');


// use gzip
// app.use(compression());

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
function setHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*');
}

app.use(webpackHotMiddleware(compiler));

function renderDefaultTemplate(res, baseUrl) {
  res.render('index', {
    og: false,
    url: baseUrl,
  });
}

app.all('*', (req, res, next) => {
    console.log('development:'+development);
    console.log('hostname:'+`${req.hostname}:${port}${req.url}`);
    console.log('X-Forwarded-Proto:'+req.get('X-Forwarded-Proto'));
  if (!development) {
    if (req.get('X-Forwarded-Proto') === 'https' ) return next();
    return res.redirect(`https://${req.hostname}${req.url}`);
  } else {
    return next();
  }

});

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('*', (req, res) => {
  const path = req.path;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  renderDefaultTemplate(res, baseUrl);
  res.end();
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
