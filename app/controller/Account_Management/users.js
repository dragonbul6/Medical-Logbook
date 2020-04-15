const userModel = require('../../models/user/ีuserModel');
const IndicateKey = require('../../../config/keyJWT');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const util = require('../../../config/message');
const mongoose = require('mongoose');


exports.onCreate = (req,res,next) => {
        try {
            let data = req.body;

            let user = new userModel(data);
    
            user.save((err,result) => {
                if(err){
                    next(err);
                }else{
                    res.json({status:true,message:"User added"});
                }
            });
        } catch (error) {
            res.status(400).json(util.getMsg(40300));
        }
       
    };

exports.Oauth =  (req,res,next) => {
    
    try {
        var username = req.body.username;
        var password = req.body.password;
    
    userModel.findOne({username:username},(err,userInfo) => {
        if(err){
            next(err);
        }else{
            if(bcrypt.compareSync(password,userInfo.password)){
                const PAYLOAD = userInfo;
                const token = jwt.encode(PAYLOAD,IndicateKey.KEY);
                const time = Date.now();
                userModel.findByIdAndUpdate({_id:userInfo._id},{lastlogin:time},async (err,doc) => {
                    if(err){
                        next(err);
                    }
                });
                res.status(200).json({message:"Login Successful!",data:{user:userInfo,token:token}});
            }else{
                res.json({status:"error", message: "Invalid username/password!!!", data:null});
            }
        }
    });
    } catch (error) {
        res.status(400).json(util.getMsg(40300));
    }
    
};
   

exports.onReads = (req,res) => {
    userModel.find({},(err,doc)=>{
        if(err) {
            console.log(err);
        }

        res.status(200).json(doc)

    })
};

exports.onRead = (req,res) => {
    let {_id} = req.query;

    userModel.findById(_id,(err,doc) => {
        if(err){
          res.status(401).json({msg:'ไม่พบผู้ใช้'});
        }
        res.status(200).json(doc);
    });
};

exports.onDelete = (req,res) => {
    let {_id} = req.query;

    userModel.findByIdAndDelete(_id,(err,doc) => {
        if(err){
            res.status(401).json({msg:'ไม่พบผู้ใช้'});
        }
        res.status(200).json({msg:'delete '+doc._id})
    });
};

exports.onUpdate = (req,res) => {
    let {_id} = req.query;
    userModel.findByIdAndUpdate(_id,req.body,(err,doc) => {
        if(err){
            res.status(400).json({msg:'Have an error'});
        }else{
            res.status(200).json(doc)
        }
    })
};

exports.ongetRole = (req,res) => {
    let {role} = req.query;
    
    if(role === 'advisor'){
        userModel.find({role:role})
        .populate("advisorInfo.advisor_studentCase")
        .exec((err,doc) => {
            if(err){
                console.log(err)
                res.status(400).json({msg:'Have an error'});
            }else{
                res.status(200).send(doc);
            }    
        })
    }else{
        userModel.find({role:role},(err,doc) => {
            if(err){
                res.status(400).json({msg:'Have an error'});
            }else{
                res.status(200).send(doc)
            }
        })
    }
    
}

exports.resetPassword = (req,res) => {
    try {
        var {username,newPassword} = req.body;
       
        bcrypt.hash(newPassword,10,(err,hashed) => {
            var update = {password : hashed};

            if(err){
                console.log(err)
            }
            
            userModel.findOneAndUpdate({username},update,(err,result) => {
                if(err){
                    console.log(err)
                }
                try {
                    var msg = util.getMsg(200);
                    
                    if(result){
                        msg.data = result;
                        res.status(200).json(msg);
                    }else{
                        res.status(404).json(util.getMsg(40402));
                    }
                } catch (error) {
                    res.status(403).json(util.getMsg(40300));
                }
                
            });
        })


    } catch (error) {
        res.status(403).json(util.getMsg(40300));
    }
}

exports.addStudentInAdvisorProfile = (req,res) => {
    try {
        var id = req.query._id;
        var arrayStudentId = req.body.student_id;


        for (const studentId of arrayStudentId) {

            
                userModel.findByIdAndUpdate(id,{$push:{"advisorInfo.advisor_studentCase" : studentId}},(err,result) => {
                    if(err){
                        console.log(err)
                        res.status(500).json(util.getMsg(50004));
                    }else{
                        res.status(200).json(util.getMsg(200));
                    }
    
                });
            
            
        }
    } catch (error) {
        res.status(403).json(util.getMsg(40300));
    }
}
