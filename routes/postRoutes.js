const Post = require('../app/controller/Posting_Management/post');
const Comment = require('../app/controller/Posting_Management/comment');
const Hospital = require('../app/controller/Hospital_Management/hospital');
const Notification = require('../app/controller/Notification/Notification');
const user = require('../app/controller/Account_Management/users');
const achievement = require('../app/controller/Achievement_Management/achievement');
//middleware
const middleware = require('../helper/middleware/post');
const helper = require('../helper/middleware/checkAuth');
const checkDuplicate = require('../helper/middleware/checkduplicate');


module.exports = (app) => {
    const path = '/api/post/';
    const pathComments = '/api/comment/';

        //Post Routes;
    app.post(path+"create",helper.verifyToken,Post.create,middleware.pushNotify,Notification.push);
    app.get(path+"all",Post.getall);
    app.get(path+"allM/",Post.getAll_Mobile);
    app.get(path+"",Post.getSpecific);
    app.put(path+"update/",helper.verifyToken,Post.update);
    app.delete(path+"delete/",helper.verifyToken,Post.delete);
    app.put(path+"approval/",helper.checkHosIdtoPOSTApproval,checkDuplicate.checkPostId,Post.approval,Hospital.addPostIdinHospital,achievement.calculateXp,user.gainXp);

        //Comments Routes;
    app.post(pathComments+"create",helper.verifyToken,Comment.create);
    app.put(pathComments+"update/",helper.verifyToken,Comment.update);
    app.delete(pathComments+"delete/",helper.verifyToken,Comment.delete);

    
    
}