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
                    if(result){
                        var student_id = result.student_id;
                        
                        UserSchema.findById(student_id).exec((err,doc) => {
                            if(err){
                                console.log(err)
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                if(doc){
                                    req.profile = doc;
                                    req.hosid = doc.studentInfo.student_hospital; 
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
    },
    checkStudentAtHospital: async (req,res,next) => {
        try {
            var student_id = req.body.student_id;
            
            if(student_id.length > 0){
                
              UserSchema.find({role : 'student'})
              .select('_id')
              .exec((err,result) => {
                if(err){
                    console.log(err)
                }else{

                    var target = [];
                    var filted = [];

                    result.map((item) => {
                        target.push(item._id);
                    })
                    
                   student_id.map((item,index) => {
                       filted.push(target.find((a) => item == a))
                    });
                    
            
                    req.body.student_id = filted.filter((item) => item !== void 0)
                    next();
                    
                }
              })
              
            }else{
                
                res.status(403).json(util.getMsg(40300));
            }

        } catch (error) {
            console.log(error)
            res.status(400).json(util.getMsg(40300));
        }
    },

    
};