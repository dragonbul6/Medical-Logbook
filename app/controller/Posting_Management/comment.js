const Comment = require('../../models/post/commentModel');
const Post = require('../../models/post/postingModel');


module.exports = {
    create : (req,res) => {
        let {postId,detail} = req.body;

       Post.findById(postId,async (err,result) => {
           if(err){
               res.json({msg:'not found post'})
           }
           
           let data = {postId : await result._id , detail};
           let comment = new Comment(data);

           comment.save(async (err,result) => {
               if(err){
                   res.json({msg:err})
               }else{
                Post.findByIdAndUpdate(postId,{$push:{comment:result._id}},(err,result)=>{
                    if(err){
                        res.json({msg:err})
                    }else{
                        res.json({msg:'post have updated'})
                    }
                });
               }
           });

       });
    },
    update : (req,res) => {
        let data = req.body;
        let commentId = req.query._id;

        Comment.findByIdAndUpdate(commentId,data,(err,result) => {
            if(err){
                return res.status(400).json({msg : "something error"})
            }else{
                return res.status(200).json({msg:"updated"})
            }
        });
    },
    delete : (req,res) => {
        let commentId = req.query._id;
        Comment.findByIdAndDelete(commentId,(err,result) => {
            if(err){
                return res.status(400).json({msg : "not found _id"})
            }else{
                return res.status(200).json({msg:"deleted"})
            }
        });
    },


}