const Post = require('../../models/post/postingModel');
const helpers = require("../../../helper/utilize/post");
const util = require('../../../config/message');

module.exports = {
    create : (req,res,next) => { 
        
        try {
            var student_id = req.profile._id;
            var nameAuther = req.profile.studentInfo.student_name;
            var hosid = req.profile.studentInfo.student_hospital;
            
            if(hosid == void 0){
                res.status(400).json({"msgTh" : "ผู้ใช้ไม่ได้ลงทะเบียนโรงพยาบาล จึงไม่สามารถโพสเคสได้ โปรดติดต่อแอดมิน" , "status" : 400 , "msgEn" : "User have not allow to post,please contact admin"})
            }else{
                var data = {
                    poster : nameAuther,
                    student_id : student_id,
                    Category : req.body.Category,
                    Problem : req.body.Problem,
                    Problem_list : req.body.Problem_list,
                    Discussion : req.body.Discussion,
                    Diagnosis : req.body.Diagnosis,
                    Examination : req.body.Examination,
                    PatientProfile : {
                        name : req.body.PatientProfile.name,
                        HN : req.body.PatientProfile.HN,
                        Age : req.body.PatientProfile.Age
                    },
                    Location : hosid
                };
    
                let post = new Post(data);
                post.student_id = student_id;
                
                post.save((err,result) => {
                    if(err){
                        console.log("[post creating]",err)
                    }
                    else{
                        req.body.newPostId = result._id;
                        next();
                    }
                });
            }

            

        } catch (error) {
            console.log(error)
        }
    },
    update : (req,res) => {
        try {
            let data = req.body;
            let postId = req.query._id;
            var PosterId = req.profile._id;

            Post.findById(postId).exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50001));
                }else{
                    if(result !== void 0){
                        if(PosterId == result.student_id){
                            result.updateOne(data).exec((err,doc) => {
                                if(err){
                                    console.log(err)
                                    res.status(400).json(util.getMsg(400));
                                }else{
                                    res.status(200).json(util.getMsg(200));
                                }
                            });
                        }else{
                            res.status(401).json(util.getMsg(40103));
                        }
                    }else{
                        res.status(404).json(util.getMsg(40402));
                    }
                }
            });

        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
        
    },
    delete : (req,res) => {
        try{
            let postId = req.query._id;
            var PosterId = req.profile._id;

        Post.findById(postId).exec((err,result) => {
            if(err){
                console.log(err);
                res.status(500).json(util.getMsg(50001));
            }else{
                if(result !== void 0){
                   if(PosterId == result.student_id){
                    result.remove((err,doc) => {
                        if(err){
                         console.log(err)
                         res.status(500).json(util.getMsg(50005));
                            }else{
                                res.status(200).json(util.getMsg(200));
                            }
                    });
                   }else{
                    res.status(401).json(util.getMsg(40103));
                   }
                   
                }else{
                    res.status(401).json(util.getMsg(40103));
                }
            }
        });
        }catch(error){
            res.status(400).json(util.getMsg(404041));
        }
        
    },
    getall : (req,res) => {
        Post.find({})
        .populate('comment')
        .populate('commenter')
        .populate('Location')
        .populate('Problem').populate('Category')
        .exec((err,result) => {
            if(err) res.status(400).json({msg:'not found'});
            

                res.status(200).json(result);
            

        });
    },
    getSpecific : (req,res) => {
        try {
            let postId = req.query._id;;

        Post.findById(postId)
        .populate('comment')
        .populate('commenter')
        .populate('Location')
        .populate('Problem').populate('Category')
        .exec((err,result) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }else{
                var object = util.getMsg(200);
            object.data = result;
            res.status(200).json(object);
            }
            
        });
        } catch (error) {
            console.log(error)
            res.status(400).json(util.getMsg(40401));
        }
        
    },
    approval : (req,res,next) => {
        try {
            var id = req.query._id;

            Post.findByIdAndUpdate(id,{approval:true}).exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50001));
                }else{
                    req.postid = id;
                    next();
                }
            })
        } catch (error) {
            console.log(error)
            res.status(400).json(util.getMsg(40401));
        }
    }

}

