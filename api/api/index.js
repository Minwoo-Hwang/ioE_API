const Router = require('koa-router');

const api = new Router();
const auth = require('./auth');
const devices = require('./devices');

api.use('/auth', auth.routes());
api.use('/devices', devices.routes());

module.exports = api;