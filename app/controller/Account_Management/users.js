const userModel = require('../../models/user/ีuserModel');
const IndicateKey = require('../../../config/keyJWT');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

exports.onCreate = (req,res,next) => {
        let {username,password} = req.body;
        let data = {};
        data= {
            username: username,
            password: password
        };
       
        
        let user = new userModel(data);

        user.save((err,result) => {
            if(err){
                next(err);
            }else{
                res.json({status:true,message:"User added"});
            }
        });
    }

exports.Oauth =  (req,res,next) => {
    let {username,password} = req.body;
    
    userModel.findOne({username:username},(err,userInfo) => {
        if(err){
            next(err);
        }else{
            if(bcrypt.compareSync(password,userInfo.password)){
                const PAYLOAD = {
                    id : userInfo.username,
                    expireIn : 86400
                };
                const token = jwt.encode(PAYLOAD,IndicateKey.KEY);
                const time = Date.now();
                userModel.findByIdAndUpdate({_id:userInfo._id},{lastlogin:time},async (err,doc) => {
                    if(err){
                        next(err);
                    }
                });
                res.status(200).json({message:"Login Successful!",data:{user:userInfo,token:token}});
            }else{
                res.json({status:"error", message: "Invalid email/password!!!", data:null});
            }
        }
    });
}
   
