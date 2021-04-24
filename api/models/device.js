const mongoose = require('mongoose');
const { Schema } = mongoose;

const Device = new Schema({
    device: String,
    elv_id: String,
    info: {
        building: String,
        address: String,
        owner: {
            username: String,
            email: String
        }
    },
    status: {
        online: {
            type: Boolean,
            default: false
        },
        order: {
            smps: Boolean,
            subport: Boolean,
        },
        action:{
            smps: Boolean,
            subport: Boolean
        },
        input:{
            safety: Boolean,
            door: Boolean,
            doorzone: Boolean
        }
    },
    updatedAt: { // 기본값을 설정할땐 이렇게 객체로 설정해줍니다
        type: Date,
        default: Date.now // 기본값은 현재 날짜로 지정합니다.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

Device.statics.findByDevice = function(device){
    return this.findOne({'device': device}).exec();
}

Device.statics.findByElvid = function(elvId){
    return this.findOne({'elv_id': elvId}).exec();
}

Device.statics.findByEmail = function(email){
    return this.find({'info.owner.email': email}).exec();
}

Device.statics.register = function({device, elv_id, building, address, username, email}){
    const _device = new this({
        device,
        elv_id,
        info:{
            building,
            address,
            owner:{username, email}
        },
        status: {
            order: {
                smps: false,
                subport: false,
            },
            action:{
                smps: false,
                subport: false
            },
            input:{
                safety: false,
                door: false,
                doorzone: false
            }
        }
    });

    return _device.save();
}

Device.statics.updateStatus = function(deviceid, payload){
    const {order, action, input} = payload;
    let obj = new Object();
    let device;

    if(order){
        obj['status.order'] = order;
    }
    if(action){
        obj['status.action'] = action;
    }
    if(input){
        obj['status.input'] = input;
    }

    if(Object.keys(obj).length > 0){
        obj['updatedAt'] = Date.now();
    }
    device = this.findOneAndUpdate({device: deviceid}, obj, {new:true})

    return device;
}

Device.statics.updateOnline = function(query){
    let device;
    let now = new Date(Date.now());
    let dateAdd = new Date(query.updatedAt);
    dateAdd.setSeconds(dateAdd.getSeconds() + 5);
    
    (dateAdd > now) ? 
    device = this.findOneAndUpdate(query.toJSON(), {"status.online" : true}, {new:true}) :
    device = this.findOneAndUpdate(query.toJSON(), {"status.online" : false}, {new:true})

    return device;
}

// 스키마를 모델로 변환하여, 내보내기 합니다.
module.exports = mongoose.model('Device', Device);