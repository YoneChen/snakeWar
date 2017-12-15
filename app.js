const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const router = require('koa-router')();
const http = require('http').createServer(app.callback());
const webpack = require('webpack');
const devConfig = require('./build/webpack.dev.js');
const compile = webpack(devConfig);
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware');
// app.use(bodyParser());
app.use(serve(__dirname + '/dist'));
app.use(router.routes());
app.use(devMiddleware(compile, {
    // display no info to console (only warnings and errors)
    noInfo: false,

    // display nothing to the console
    quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    lazy: true,

    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    publicPath: devConfig.publicPath,

    // custom headers
    headers: { "X-Custom-Header": "yes" },

    // options for formating the statistics
    stats: {
        colors: true
    }
}))
app.use(hotMiddleware(compile, {
    // log: console.log,
    // path: '/__webpack_hmr',
    // heartbeat: 10 * 1000
  }))
router.get('/search',async (ctx,next) => {
    ctx.body = {
        res:'0000',
        list: [
            {
                id: '123',
                name: '丁字裤',
                descript: '性感情趣，物美价廉',
                price: '12',
                comment: '140',
                sale: '2345'
            }
        ]
    };
}); 
router.get('/recommend',async (ctx,next) => {
    ctx.body = {
        res:'0000',
        list: [
            '内裤',
            '雨衣',
            '太阳镜'
        ]
    };
});
http.listen(3002);
