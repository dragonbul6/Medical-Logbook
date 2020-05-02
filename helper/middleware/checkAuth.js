const jwt = require('jwt-simple');
const Indicator = require('../../config/keyJWT');
const UserSchema = require('../../app/models/user/ีuserModel');
const Hospital = require('../../app/models/hospital/hospitalModel');
const Post = require('../../app/models/post/postingModel');
const util = require('../../config/message');



module.exports = {
    verifyToken: (req,res,nex)=>{
        try {
            let token = req.headers["authorization"];
            let decoded = jwt.decode(token,Indicator.KEY);

            UserSchema.findById(decoded._id,(err,doc) => {
               try {
                if(err) return res.status(500).json(util.getMsg(50000));
                
                if(doc){
                    var data = doc;
                    req.profile = data;
                    nex();
                }else{
                    res.status(401).json(util.getMsg(401));
                }

               } catch (error) {
                res.status(404).json(util.getMsg(40402));  
               }
               
            });
    

        } catch (error) {
            res.status(401).json(util.getMsg(401));
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
    checkAdvisor : (req,res,next) => {
        try {
            var {_id} = req.query;
            UserSchema.findById(_id,(err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json(util.getMsg(50004));
                }else{
                    if(result){
                        if(result.role === 'advisor'){
                            next();
                        }else{
                            res.status(403).json(util.getMsg(40303));
                        }
                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })
        } catch (error) {
            res.status(400).json(util.getMsg(40300));
        }
    },
    checkHosIdtoPOSTApproval : (req,res,next) => {
        try {
            var id = req.query._id;
            Post.findById(id).exec((err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json(util.getMsg(50004));
                }else{
                    if(result !== void 0){

                        var student_id = result.student_id;
                        
                        UserSchema.findById(student_id).exec((err,doc) => {
                            if(err){
                                console.log(err)
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                if(doc !== void 0){
                                    req.profile = doc;
                                    next();
                                    
                                }else{
                                    res.status(404).json(util.getMsg(40402));
                                }
                            }
                        })

                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })


        } catch (error) {
            res.status(400).json(util.getMsg(40300));
        }
    }
    
};