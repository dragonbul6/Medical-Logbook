const userModel = require('../../models/user/ีuserModel');
const IndicateKey = require('../../../config/keyJWT');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const util = require('../../../config/message');



var checkNullforUpdate = (data,master) => {
    var temp = Object.assign({},master);


    if(data.username !== void 0){
        temp.username = data.username;
    }

    if(data.studentInfo !== void 0){
        if(data.studentInfo.student_name !== void 0){
            temp.studentInfo.student_name = data.studentInfo.student_name
        }
    
        if(data.studentInfo.student_goals !== void 0){
            temp.studentInfo.student_goals = data.studentInfo.student_goals
        }
    
        if(data.studentInfo.student_id !== void 0){
            temp.studentInfo.student_id = data.studentInfo.student_id
        }

        if(data.studentInfo.student_year !== void 0){
            temp.studentInfo.student_year = data.studentInfo.student_year
        }
    }

    if(data.advisorInfo !== void 0){
        if(data.advisorInfo.advisor_name !== void 0){
            temp.advisorInfo.advisor_name = data.advisorInfo.advisor_name
        }

        if(data.advisorInfo.receiving !== void 0){
            temp.advisorInfo.receiving  = data.advisorInfo.receiving
        }
    }
    

    return temp;

  }

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


exports.LoginAdvisor = (req,res) =>{
    try {
        var username = req.body.username;
        var password = req.body.password;
    
    userModel.findOne({username:username},(err,userInfo) => {
        if(err){
            next(err);
        }else{
            if(userInfo){
                if(userInfo.role === 'advisor'){
                    if(bcrypt.compareSync(password,userInfo.password)){
                        const PAYLOAD = userInfo;
                        const token = jwt.encode(PAYLOAD,IndicateKey.KEY);
                        const time = Date.now();
                        userModel.findByIdAndUpdate({_id:userInfo._id},{lastlogin:time},async (err,doc) => {
                            if(err){
                                next(err);
                            }
                        });
                        res.status(200).json({message:"Login Successful!",data:{user:userInfo,token:token,_id:userInfo._id}});
                    }else{
                        res.json({status:"error", message: "Invalid username/password!!!", data:null});
                    }
                }else{
                    res.status(401).json(util.getMsg(40103));
                }
            }else{
                res.status(404).json(util.getMsg(40402));
            }
            
            
        }
    });
    } catch (error) {
        res.status(400).json(util.getMsg(40300));
    }
}
   

exports.onReads = (req,res) => {
    userModel
    .find({})
    .populate('studentInfo.student_advisorId')
    .populate('advisorInfo.advisor_studentCase')
    .exec((err,doc)=>{
        if(err) {
            console.log(err);
        }

        res.status(200).json(doc)

    })
};

exports.onRead = (req,res) => {
    let {_id} = req.query;
    
    userModel.findById(_id)
    .populate('studentInfo.student_advisorId')
    .populate('advisorInfo.advisor_studentCase')
    .exec((err,doc) => {
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
   
        var {_id} = req.query;
        var data = req.body;
        userModel.findById(_id,(err,master) => {
            if(err){
                console.log(err);
            }else{
                var updateChunk = checkNullforUpdate(data,master._doc)
                master.updateOne(updateChunk,(err,result) => {
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).json(util.getMsg(200));
                        }
                    });
                
            }
        });
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
        userModel.find({role:role})
        .populate("studentInfo.student_advisorId")
        .exec((err,doc) => {
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

exports.addStudentInAdvisorProfile = async (req,res,next) => {
    
    
    try {
        var id = req.query._id;
        var arrayStudentId = req.body.student_id;


        for (const studentId of arrayStudentId) {

                await userModel.findByIdAndUpdate(id,{$push:{"advisorInfo.advisor_studentCase" : studentId}},(err,result) => {
                    if(err){
                        console.log(err)
                        res.status(500).json(util.getMsg(50004));
                    }else{
                        var query = {"studentInfo.student_advisorId" : result._id};
                        
                        userModel.findByIdAndUpdate(studentId,query)
                        .exec(async (err,stResult) => {
                            if(err){
                                console.log(err)
                                res.status(500).json(util.getMsg(50004));
                            }
                        });   
                    }
                });      
        }

                        res.status(200).json(util.getMsg(200));
    } catch (error) {
        res.status(403).json(util.getMsg(40300));
    }
}

