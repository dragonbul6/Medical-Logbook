const jwt = require('jwt-simple')
const Indicator = require('../../config/keyJWT')
const UserSchema = require('../../app/models/user/ีuserModel')
const util = require('../../config/message')



module.exports = {
    verifyToken: (req,res,nex)=>{
        try {
            let token = req.headers["token"];
    
        if(!token){
            return res.status(400).json(util.getMsg(40102));
        }else{
            let decoded = jwt.decode(token,Indicator.KEY);
            
            UserSchema.findOne({username:decoded.id},(err,doc) => {
                if(err) return res.status(500).send("There was a problem finding the user.");
                if(!doc) return res.status(404).send("No user found.");
                
            });
    
            nex();
    
        }
        } catch (error) {
            res.status(400).json(util.getMsg(40300));
        }
        
      
    },
    checkUsername: (req,res,next) => {
        try {
            var {username} = req.body;
            UserSchema.find({username},(err,result) => {
                
                if(err){
                    console.log(err)
                }
                
                if(username.length > 0){
                    res.status(20001).json(util.getMsg(20001));
                }else{
                    next();
                }
            })
        } catch (err) {
            res.status(400).json(util.getMsg(40300));
        }
    }
};