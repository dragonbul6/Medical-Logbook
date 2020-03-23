const Post = require('../../models/post/postingModel');

module.exports = {
    create : (req,res,next) => {
        let data = req.body;

        let post = new Post(data);

        post.save((err,result) => {
            if(err) next(err);
            else{
                res.status(200).json({status:true,message:"Posted"});
            }
        })
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