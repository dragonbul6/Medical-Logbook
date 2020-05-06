

const UserSchema = require('../../app/models/user/ีuserModel');
const HospitalSchema = require('../../app/models/hospital/hospitalModel');
const Achievement = require('../../app/models/achievement/achievement');
const util = require('../../config/message');



module.exports = {
    checkDuplicateStudentId : (req,res,next) => {
        try {
            var student_id = req.body.student_id;
            var id = req.query._id;
            
            UserSchema.findById(id,(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    if(result !== void 0){
                        var currentArray = result.advisorInfo.advisor_studentCase;
                        if(currentArray.length > 0){
                            
                            for (const xid of student_id) {
                                currentArray.push(xid)
                            }

                        
                            var arrResult = currentArray.filter((item,index) => currentArray.indexOf(item) === index);
                            req.body.student_id = arrResult;

                    }
                    
                } 
                    next();
                    
                }
            });

        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
    },
    hospitalCheckIdStudent : (req,res,next) => {
        try {
            var student_id = req.body.student_id;
            var id = req.query._id;
            
            
            if(student_id.length == 0){
                res.status(403).json(util.getMsg(40300));
            }

            HospitalSchema.findById(id,(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    if(result){
                        var currentArray = result.studentList;

                            for (const xid of student_id) {
                                currentArray.push(xid)
                            }
                            var arrResult = currentArray.filter((item,index) => currentArray.indexOf(item) === index);
                            req.body.student_id = arrResult;
                            
                            next();
                }else{
                    res.status(404).json(util.getMsg(40401));
                } 
               
                    
                }
            });

        } catch (error) {
             res.status(403).json(util.getMsg(40300));
        }
    },
    checkPostId : (req,res,next) => {
        try {
            
            var id = req.query._id;
            var hosId = req.hosid;

            HospitalSchema.findById(hosId).exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    if(result){
                        var postlist = result.postList;
                        var duplicate = [];
                        
                        postlist.map((item) => {
                            if(item == id){
                                duplicate.push(item);
                            }
                        });

                        if(duplicate.length > 0){
                            res.status(403).json(util.getMsg(40301));
                        }else{
                            next();
                        }

                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            });


        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
    },
    checkStudentId_Achievement : (req,res,next) => {
        try {
            var student_id = req.query._id;
            Achievement.find({student_id : student_id})
            .exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    if(result.length > 0){
                        res.status(403).json(util.getMsg(40301));
                    }else{
                        next();
                    }
                }
            })
            
        } catch (error) {
            res.status(403).json(util.getMsg(40300)); 
        }
    }
};