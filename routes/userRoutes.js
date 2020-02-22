
const userController = require('../app/controller/Account_Management/users');;


module.exports = (app)=>{
    const path = `/api/user/`;

    app.post(path+`login`,userController.Oauth);
    app.post(path+`create`,userController.onCreate);
    app.get(path,userController.onReads);
    app.get(path,userController.onRead);
    app.put(path+'update',userController.onUpdate);
    app.delete(path+`delete`,userController.onDelete);
   

}