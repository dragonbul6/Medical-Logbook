const moongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = moongoose.Schema;

let UserSchema = new Schema({
    
        username : {type:String,required:true},
        password: {type:String,required:true},
        lastlogin : {type:Date,default: null},
        role:{type:String,default:null},
        studentInfo:{
                student_name : {type:String,default:null},
                student_exp : {type:Number,default:0},
                student_goals : [{
                    goalDetail:{type:String,default:null},
                    goalStatus:{type:Boolean,default:false}
                }],
                student_advisorId:{type:Schema.Types.ObjectId, ref : 'User',default:null},
                student_id:{type:String,default:null},
                student_year : {type:String,default:null},
                student_hospital : {type:Schema.Types.ObjectId, ref : 'Hospital',default:null}
                        },
        advisorInfo : {
                    advisor_name : {type:String,default:null},
                    advisor_studentCase : [{type:Schema.Types.ObjectId, ref : 'User'}],
                    receiving : {type:Boolean,default:false},
                    deviceToken : [{type:String}]
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

UserSchema.pre('findOneAndUpdate',function (next) {
    var user = this;

    bcrypt.genSalt(10,(err,salt) => {
        if(err){
            next(err)
        }

        bcrypt.hash(user.password,salt,(err,hash) => {
            user.password = hash;
            next();
        });
    });
})

module.exports = moongoose.model('User',UserSchema,'User');