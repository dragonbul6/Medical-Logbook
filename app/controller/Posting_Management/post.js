const Post = require('../../models/post/postingModel');
const helpers = require("../../../helper/utilize/post");
const util = require('../../../config/message')
module.exports = {
    create : async (req,res) => {
       
        try {
            let data,{student_id} = req.body;
        
            let post = new Post(data);
            post.student_id = student_id;
            
            post.save((err,result) => {
                if(err) console.log(err);
                else{
                    res.status(200).json(util.getMsg(200));
                }
            });

            helpers.getAdvisorbystudentId(student_id,(result) => {
                try{
                    helpers.getDeviceToken(result)
                }catch(error){
                    res.status(402).json(util.getMsg(404042));
                }
            }
            );
        } catch (error) {
            res.status(402).json(util.getMsg(404042));
        }
           

        //หลังจาก post จะแจกเตือนไปยัง advisor
        
       

        
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