const Router = require('koa-router');
const devices = new Router();
const devicesCtrl = require('./devices.controller');

devices.post('/', devicesCtrl.register);
devices.get('/', devicesCtrl.list);
devices.get('/:elvId', devicesCtrl.get);
devices.patch('/status/:deviceid', devicesCtrl.status);

module.exports = devices;