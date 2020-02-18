const moongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = moongoose.Schema;

let UserSchema = new Schema({
    
        username : {type:String,required:true},
        password: {type:String,required:true},
        lastlogin : {type:Date,default: null},
    
    accountDetail: {
        role:{type:String,default:null},
        name : {type:String,default:null},
        goals : [{
            goalDetail:{type:String,default:null},
            goalStatus:{type:Boolean,default:false}
        }]
    }
});

UserSchema.pre('save',function (next){
    let user = this;

    bcrypt.genSalt(10,(err,salt) => {
        if(err){
            next(err)
        }

        bcrypt.hash(user.password,salt,(err,hash) => {
            user.password = hash;
            next();
        });
    });
});

module.exports = moongoose.model('User',UserSchema,'User');