
const userController = require('../app/controller/Account_Management/users');;


module.exports = (app)=>{
    const path = `/api/`;

    app.post(path+`login`,userController.Oauth);
    app.post(path+`create`,userController.onCreate);
   

}