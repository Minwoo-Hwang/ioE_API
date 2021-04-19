const Device = require ('../../models/device');
const Joi = require ('joi');

exports.register = async(ctx) => {
    const schema = Joi.object().keys({
        device: Joi.string().alphanum().required(),
        elv_id: Joi.string().alphanum().required(),
        building: Joi.string().required(),
        address: Joi.string().required(),
        username: Joi.string().alphanum().required(),
        email: Joi.string().email().required()
    });

    const result = schema.validate(ctx.request.body);

    if(result.error){
        ctx.status = 400;
        return;
    }

    let existing = null;
    try {
        existing = await Device.findByDevice(ctx.request.body.device);
    } catch (e) {
        ctx.throw(500, e);
    }

    if(existing){
        ctx.status = 409;
        ctx.body = {
            messege: 'existing device' 
        };
        return;
    }

    let device = null;
    try{
        device = await Device.register(ctx.request.body);
    } catch(e) {
        ctx.throw(500, e);
    }

    ctx.body = device;

}

exports.list = async(ctx) => {
    const {user} = ctx.request;

    if(!user) {
        ctx.status = 403; // Forbidden
        return;
    }

    let devices;
    try{
        devices = await Device.findByEmail(user.profile.email);
    }catch(error){
        return ctx.throw(500, error);
    }

    if(!devices) {
        // 존재하지 않으면
        ctx.status = 404;
        ctx.body = { message: 'devices not found' };
        return;
    }

    ctx.body = devices;
}

exports.get = async(ctx) => {
    const {elvId} = ctx.params;
    const {user} = ctx.request;

    if(!user){
        ctx.status = 403; // Forbidden
        return;
    }

    const email = user.profile.email;
    
    let device;
    
    try{
        device = await Device.findByElvid(elvId);
    }catch(error){
        ctx.throw(500, error);
    }

    if(!device) {
        // 존재하지 않으면
        ctx.status = 404;
        ctx.body = { message: 'device not found' };
        return;
    }

    if(device.info.owner.email !== email){
        ctx.status = 403; // Forbidden
        return;
    }
    ctx.body = device;
}

exports.status = async(ctx) => {
    const {deviceid} = ctx.params;
    const {order, action, input} = ctx.request.body;
    
    const schema = Joi.object().keys({ // 객체의 field 를 검증합니다.
        order: {
            smps: Joi.boolean(),
            subport: Joi.boolean(),
        },
        action:{
            smps: Joi.boolean(),
            subport: Joi.boolean()
        },
        input:{
            safety: Joi.boolean(),
            door: Joi.boolean(),
            doorzone: Joi.boolean()
        }
    });

    // 그 다음엔, validate 를 통하여 검증을 합니다.
    const result = schema.validate(ctx.request.body); // 첫번째 파라미터는 검증할 객체이고, 두번째는 스키마입니다.

    // 스키마가 잘못됐다면
    if(result.error) {
        ctx.status = 400; // Bad Request
        return;
    }

    let device;
    
    try{
        device = await Device.updateStatus(deviceid, ctx.request.body);
    }catch(error){
        return ctx.throw(500, error);
    }

    ctx.body = device;
}