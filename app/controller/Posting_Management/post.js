const Post = require('../../models/post/postingModel');
const helpers = require("../../../helper/utilize/post");

module.exports = {
    create : async (req,res) => {
        let data,{student_id} = req.body;
        
        let post = new Post(data);
        post.student_id = student_id;
        
        post.save((err,result) => {
            if(err) console.log(err);
            else{
                res.status(200).json({status:true,message:"Posted"});
            }
        });

        //หลังจาก post จะแจกเตือนไปยัง advisor
        helpers.getAdvisorbystudentId(student_id,(result) => helpers.getDeviceToken(result));
       

        
    },
    update : (req,res) => {
        let data = req.body;
        let postId = req.query._id;

        Post.findByIdAndUpdate(postId,data,(err,result) => {
            if(err) res.status(400).json({msg:'Have an error'});
            else res.status(200).json(result);
        });
    },
    delete : (req,res) => {
        let postId = req.query._id;

        Post.findByIdAndDelete(postId,(err,result)=>{
            if(err) res.status(400).json({msg:'not found'});
            
            res.status(200).json({msg:'delete '+postId});
        });
    },
    getall : (req,res) => {
        Post.find({})
        .populate('comment')
        .exec((err,result) => {
            if(err) res.status(400).json({msg:'not found'});
            res.status(200).json(result);
        })
    },
    getSpecific : (req,res) => {
        let postId = req.query._id;;

        Hospital.findById(postId,(err,result) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }
            res.status(200).json(result)
        })
    },

}