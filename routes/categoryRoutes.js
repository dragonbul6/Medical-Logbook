const CategoryController = require('../app/controller/Problem_Management/category');

module.exports = (app) => {
    const path = `/api/category/`;

    app.get(path,CategoryController.getOne);
    app.get(path+`all`,CategoryController.getAll);
    app.put(path+`update/`,CategoryController.update);
    app.delete(path+`delete/`,CategoryController.delete);
    app.post(path+`create`,CategoryController.create);
    app.get(path+`array`,CategoryController.GetArray);
}