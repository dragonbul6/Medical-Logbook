const hospitalController = require('../app/controller/Hospital_Management/hospital');
const checker = require('../helper/middleware/checkduplicate');
const checkuser = require('../helper/middleware/checkAuth');
module.exports = (app) => {
    const path = `/api/hospital/`;

    app.get(path,hospitalController.getSpecific);
    app.get(path+`all`,hospitalController.getall);
    app.put(path+`update/`,hospitalController.update);
    app.delete(path+`delete/`,hospitalController.delete);
    app.post(path+`create`,hospitalController.create);
    app.put(path+`addStudent/`,checkuser.checkStudentAtHospital,checker.hospitalCheckIdStudent,hospitalController.addStudentinHospital);
}