
const userController = require('../app/controller/Account_Management/users');;
const helper = require('../helper/middleware/checkAuth');

module.exports = (app)=>{
    const path = `/api/user/`;

    app.post(path+`login`,userController.Oauth);
    app.post(path+`create`,helper.checkUsername,userController.onCreate);
    app.get(path+`all`,userController.onReads);
    app.get(path,userController.onRead);
    app.get(path+'role/',userController.ongetRole);
    app.put(path+'update/',userController.onUpdate);
    app.delete(path+`delete/`,userController.onDelete);
    app.put(path+`resetPassword`,userController.resetPassword);
    
   

}