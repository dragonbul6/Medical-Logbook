const Comment = require('../../models/post/commentModel');
const Post = require('../../models/post/postingModel');
const util = require('../../../config/message');

module.exports = {
    create : (req,res) => {
        let {postId,detail} = req.body;
        var commentId = req.profile._id;

       Post.findById(postId,async (err,result) => {
           if(err){
               res.json({msg:'not found post'})
           }
           
           let data = {postId : await result._id , detail , commenter : commentId};
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
        var data = req.body;
        var commentId = req.query._id;
        var CommenterID = req.profile._id;

        Comment.findById(commentId,(err,result) => {
            if(err){
                console.log(err);
                res.status(500).json(util.getMsg(50004));
            }else{

                if(result !== void 0){
                    if(CommenterID == result.commenter){
                        result.updateOne(data).exec((err,res) => {
                            if(err){
                                console.log(err);
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                res.status(200).json(util.getMsg(200))
                            }
                        });
                    }else{
                        res.status(401).json(util.getMsg(40103));
                    }
                }else{
                    res.status(404).json(util.getMsg(40401));
                }
                
            }
        });
        
    },
    delete : (req,res) => {
        var commentId = req.query._id;
        var CommenterID = req.profile._id;
        
        Comment.findById(commentId).exec((err,result) => {
            if(err){
                console.log(err);
                res.status(404).json(util.getMsg(40401));
            }else{

            if(result !== void 0){
                if(CommenterID == result.commenter){
                    result.remove((err,doc) =>{
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
                res.status(404).json(util.getMsg(40401));
            }   
            }
        });

    },


}