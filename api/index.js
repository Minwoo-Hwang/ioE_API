require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const { jwtMiddleware } = require('./lib/token');

mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(
    (response) => {
        console.log('Successfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});

const port = process.env.PORT || 3300;

app.use(bodyParser());

app.use(jwtMiddleware);

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log('login server is listening to port ' + port);
});