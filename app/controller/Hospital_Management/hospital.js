const Hospital = require('../../models/hospital/hospitalModel');
const User = require('../../models/user/ีuserModel');
const util = require('../../../config/message');
module.exports = {
    create : (req,res,next)=>{
        let data = req.body;

        let hospital = new Hospital(data);
        
        hospital.save((err,result) => {
            if(err){
                next(err);
            }else{
                res.status(200).json({status:true,message:"Hospital added"});
            }
        })

    },
    update : (req,res) => {
        let data = req.body;
        let hosid = req.query._id;

        Hospital.findByIdAndUpdate(hosid,data,(err,doc) => {
            if(err){
                res.status(400).json({msg:'Have an error'});
            }else{
                res.status(200).json(doc);
            }
        });
    },
    delete : (req,res) => {
        let hosid = req.query._id;

        Hospital.findByIdAndDelete(hosid,(err,doc) => {
                if(err){
                    res.status(400).json({msg:'not found'});
                }
                res.status(200).json({msg:'delete '+doc._id});
            
        })
    },
    getall : (req,res) => {
        Hospital
        .find({})
        .populate('studentList')
        .populate('postList')
        .exec((err,doc) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }
            res.status(200).json(doc);
        })
    },
    getSpecific : (req,res) => {
        let hosid = req.query._id;

        Hospital.findById(hosid)
        .populate('studentList')
        .populate('postList')
        .exec((err,doc) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }
            res.status(200).json(doc)
        })
    },
    addStudentinHospital : (req,res) => {
        try {
            var id = req.query._id;
            var arrayStudentId = req.body.student_id;
            
            Hospital.findById(id).exec((err,result) => {
                
                if(err){
                    res.status(500).json(util.getMsg(50004));
                }else{
                    if(result !== void 0){
    
                        var query = {"studentList" : arrayStudentId}
                        
                        result.updateOne(query)
                        .exec((err,doc) => {
                            if(err){
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                var queryStudent = {"studentInfo.student_hospital" : id}
                               
                                User.find({_id : {$in: arrayStudentId}})
                                .update(queryStudent,(err,doc2) =>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                        res.status(200).json(util.getMsg(200));
                                    }
                                });
    
                            }
                        });

                    }else{
                        res.status(500).json(util.getMsg(50004));
                    }
                }

            })
        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
        
    },
    addPostIdinHospital : (req,res,next) => {
        try {
            var hosId = req.profile.studentInfo.student_hospital;
            var postId = req.postid;

            var newArray = [];
            

            Hospital.findById(hosId)
            .exec((err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json(util.getMsg(50004));
                }else{
                    
                    newArray = result.postList;
                    newArray.push(postId);
                    var query = {"postList" : newArray}

                    result.updateOne(query)
                    .exec((err,doc) => {
                        if(err){
                            console.log(err)
                            res.status(500).json(util.getMsg(50004));
                        }else{
                           next();
                        }
                    })
                   
                }
            })

        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
    }

};