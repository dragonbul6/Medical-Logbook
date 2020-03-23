const moongoose = require('mongoose');


const Schema = moongoose.Schema;

let CommentSchema = new Schema({
    postId : {type: Schema.Types.ObjectId,ref:'Posting' , required:true},
    detail : {type:String,required:true}
});

module.exports = moongoose.model('Comment',CommentSchema,'Comment');

