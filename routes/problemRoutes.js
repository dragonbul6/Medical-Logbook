const ProblemController = require('../app/controller/Problem_Management/problems');

module.exports = (app) => {
    const path = `/api/problem/`;

    app.get(path+`all`,ProblemController.getAll);
    app.get(path,ProblemController.getOne);
    app.put(path+`update/`,ProblemController.update);
    app.delete(path+`delete/`,ProblemController.delete);
    app.post(path+`create`,ProblemController.create);
}

