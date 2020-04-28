const hospitalController = require('../app/controller/Hospital_Management/hospital');
const checker = require('../helper/middleware/checkduplicate');
module.exports = (app) => {
    const path = `/api/hospital/`;

    app.get(path,hospitalController.getSpecific);
    app.get(path+`all`,hospitalController.getall);
    app.put(path+`update/`,hospitalController.update);
    app.delete(path+`delete/`,hospitalController.delete);
    app.post(path+`create`,hospitalController.create);
    app.put(path+`addStudent/`,checker.hospitalCheckIdStudent,hospitalController.addStudentinHospital);
}