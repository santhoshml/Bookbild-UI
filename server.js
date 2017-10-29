const express = require('express');
const axios = require('axios');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.prod');
const { SERVER_CONFIG } = require('./server/constants');

// server.js
// load the things we need
const development = process.env.NODE_ENV === 'development';
const port = development ? SERVER_CONFIG.PORT_DEVELOPMENT : SERVER_CONFIG.PORT_PRODUCTION;
const app = express();
const compiler = webpack(config);

// set the view engine to ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', '.');


// use gzip
app.use(compression());

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
    // console.log('development:'+development);
    // console.log('hostname:'+`${req.hostname}:${port}${req.url}`);
    // console.log('X-Forwarded-Proto:'+req.get('X-Forwarded-Proto'));
  if (!development) {
    if (req.get('X-Forwarded-Proto') === 'https' || !req.get('X-Forwarded-Proto') ) return next();
    return res.redirect(`https://${req.hostname}:${port}${req.url}`);
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
