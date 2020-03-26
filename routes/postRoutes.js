const Post = require('../app/controller/Posting_Management/post');
const Comment = require('../app/controller/Posting_Management/comment');

//middleware
const middleware = require('../helper/middleware/checkstObject');
module.exports = (app) => {
    const path = '/api/post/';
    const pathComments = '/api/comment/';

        //Post Routes;
    app.post(path+"create",middleware.checkStudentId,Post.create);
    app.get(path+"all",Post.getall);
    app.get(path+"",Post.getSpecific);
    app.put(path+"update/",Post.update);
    app.delete(path+"delete/",Post.delete);

        //Comments Routes;
    app.post(pathComments+"create",Comment.create);
    app.put(pathComments+"update/",Comment.update);
    app.delete(pathComments+"delete/",Comment.delete);
    
}