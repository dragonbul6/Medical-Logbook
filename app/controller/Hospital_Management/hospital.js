const Hospital = require('../../models/hospital/hospitalModel');
const User = require('../../models/user/ีuserModel');
const util = require('../../../config/message');
const async = require('async');

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
    addStudentinHospital : (req,res,next) => {
        try {
            var id = req.query._id;
            var arrayStudentId = req.body.student_id;

           
            
            Hospital.findById(id).exec((err,result) => {
                
                if(err){
                    res.status(500).json(util.getMsg(50004));
                }else{
                    if(result){
    
                        var query = {"studentList" : arrayStudentId}
                        
                        result.updateOne(query)
                        .exec((err,doc) => {
                            if(err){
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                req.body.command = "add";
                               next();
                                
                            }
                        });

                    }else{
                        res.status(500).json(util.getMsg(50004));
                    }
                }

            })
        } catch (error) {
            console.log(error)
            res.status(403).json(util.getMsg(40300));
        }
        
    },
    deleteStudent : (req,res,next) => {
        try {
            
            var id = req.query._id;
            var arrayStudentId = req.body.student_id;
            req.body.command = "delete";


            Hospital.findById(id).exec((err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json(util.getMsg(50004));
                }else{
                    if(result){
                        
                        var studentList = result.studentList;
                        var confirmDelete = [];
                        
                     
                        
                        //find duplicate
                        arrayStudentId.map((item,i) => {
                           var found = studentList.indexOf(item)
                            if(found > -1){
                               
                                studentList.splice(i,1)
                                confirmDelete.push(item)
                            }
                        });

                        
                        var query = {"studentList" : studentList}
                       
                        
                        result.updateOne(query)
                        .exec((err,doc) => {
                            if(err){
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                req.body.student_id = confirmDelete;
                                
                               next();
                                
                            }
                        });

                    }else{
                        res.status(404).json(util.getMsg(40401))
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
                   
                    if(result){
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
                    }else{
                        res.status(404).json(util.getMsg(40401))
                    }
                    
                    
                   
                }
            })

        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
    },
    updateinStudentProfile : (req,res) => {
        try {
            var arrayStudentId = req.body.student_id;
            
            var command = req.body.command
            console.log(command)
            var query = {}

            if(command == 'add'){
                query = {"studentInfo.student_hospital" : req.query._id}
            }else{
                query = {"studentInfo.student_hospital" : null}
            }

            async.eachSeries(arrayStudentId,function updateObject(item,done){
                User.findByIdAndUpdate(item,query,done);

            },function allDone(err){
                if(err){
                    console.log(err)
                }else{
                    res.status(200).json(util.getMsg(200));
                }
                
            })
            

        } catch (err) {
            console.log(err)
            res.status(403).json(util.getMsg(40300));
        }
    }

};