const jwt = require('jwt-simple');
const Indicator = require('../../config/keyJWT');
const UserSchema = require('../../app/models/user/ีuserModel');
const util = require('../../config/message');



module.exports = {
    verifyToken: (req,res,nex)=>{
        try {
            let token = req.headers["authorization"];
            let decoded = jwt.decode(token,Indicator.KEY);

            UserSchema.findById(decoded._id,(err,doc) => {
               try {
                if(err) return res.status(500).json(util.getMsg(50000));
                
                    var data = doc;
                    req.body = data;

                nex();
               } catch (error) {
                res.status(404).json(util.getMsg(40402));  
               }
               
            });
    

        } catch (error) {
            res.status(400).json(util.getMsg(40102));
        }
        
      
    },
    checkUsername: (req,res,next) => {
        try {
            var {username,password} = req.body;
            UserSchema.find({username},(err,result) => {
                
                if(err){
                    console.log(err)
                }
                
                if(result.length > 0){
                    res.status(200).json(util.getMsg(20001));
                }else{
                    next();
                }
            })
        } catch (err) {
            res.status(400).json(util.getMsg(40300));
        }
    },
    
};