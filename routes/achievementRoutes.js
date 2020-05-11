
const controller = require('../app/controller/Achievement_Management/achievement')
const check_duplicate = require('../helper/middleware/checkduplicate');
module.exports = (app) => {
    const path = '/api/achievement';

    app.post(path+'/create/',check_duplicate.checkStudentId_Achievement,controller.create);
    app.put(path+'/update/',check_duplicate.problem_task,controller.update);
    app.put(path+'/update_detail/',controller.update_detail);
    app.put(path+'/delete/tasks/',controller.deletetask);
    app.delete(path+'/delete/',controller.delete);
    app.get(path+"/",controller.getbyStudent);
    app.get(path+'/all',controller.getAll);
    
}