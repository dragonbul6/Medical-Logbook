const Task = require('../../models/achievement/achievement');
const util = require('../../../config/message');
const userModel = require('../../models/user/ีuserModel');

module.exports = {
    create : (req,res) => {
        try {
            var student_id = req.query._id;
            var data = {
                student_id : student_id,
                tasks : [{task : 'get approve case by advisor',quantity:5,problem_id:999,exp:2}]
            }
            var tasks = new Task(data);

            tasks.save((err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json(util.getMsg(50001));
                }else{

                    userModel.findById(student_id).exec((err,doc) => {
                        if(err){
                            console.log(err)
                            res.status(500).json(util.getMsg(50001));
                        }else{
                            if(doc){
                                doc.updateOne({"studentInfo.student_tasks" : result._id})
                                .exec((err,update) => {
                                    if(err){
                                        console.log(err);
                                        res.status(500).json(util.getMsg(50001));
                                    }else{
                                        res.status(200).json(util.getMsg(200));
                                    }
                                })
                                
                            }else{
                                res.status(404).json(util.getMsg(40402));
                            }
                        }
                    })

                }
            })
        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
    },
    update : (req,res) => {
        try {
            var achievementId = req.query._id;
            var data = {task : req.body.task , quantity : req.body.quantity , exp : req.body.exp , problem_id : req.body.problem_id};
            var query = { $push : { tasks : data}}

            Task.findById(achievementId).exec((err,result) => {
                if(err){
                            console.log(err)
                            res.status(500).json(util.getMsg(50001));
                }else{
                    if(result){
                        result.updateOne(query).exec((err,doc) => {
                            if(err){
                                console.log(err)
                                res.status(500).json(util.getMsg(50001));
                            }else{
                                res.status(200).json(util.getMsg(200));
                            }
                        })
                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })

        } catch (err) {
            res.status(400).json(util.getMsg(40401));
        }
    },
    delete : (req,res) => {
        try {
            var achievementId = req.query._id;
            Task.findByIdAndDelete(achievementId,(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50005));
                }else{
                    if(result){
                        var studentId = result.student_id;
                        userModel.findById(studentId).exec((err,updateChunk) => {
                            if(err){
                                console.log(err);
                                res.status(500).json(util.getMsg(50002));
                            }else{
                                if(updateChunk){
                                    var query = {"studentInfo.student_tasks" : null};

                                    updateChunk.updateOne(query,(err,xx) => {
                                        if(err){
                                            console.log(err);
                                            res.status(500).json(util.getMsg(50004));
                                        }else{
                                            res.status(200).json(util.getMsg(200));
                                        }
                                    });
                                }else{
                                    res.status(404).json(util.getMsg(40401));
                                }
                            }
                        });
                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                       
                }
            })
        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
    },
    calculateXp : (req,res,next) => {
        try {
            var problem_id = req.problem_id;
            var student_id = req.student_id;
    
    
            Task.find({student_id : student_id})
            .exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50005));
                }else{
                    if(result){
                        var achievement = result[0].tasks;
                        var id = result[0]._id;
                        var taskList = achievement;
                        var additionExp = 0;
                        var query = {tasks : taskList};

                        achievement.map((item,i) => {
                            if(item.problem_id == problem_id){
                                taskList[i].quantity = item.quantity - 1;  
                                if(taskList[i].quantity == 0){
                                    additionExp =+ item.exp;
                                    taskList[i].exp = 0;
                                }
                                
                            }
                        });

                        achievement.map((item,i) => {
                            if(item.problem_id == 999){
                                taskList[i].quantity = item.quantity - 1;  
                                if(taskList[i].quantity == 0){
                                    additionExp =+ item.exp;
                                    taskList[i].exp = 0;
                                }
                                
                            }
                        });

                        

                        Task.findByIdAndUpdate(id,query).exec((err,doc) =>{
                            if(err){
                                console.log(err);
                                res.status(500).json(util.getMsg(50004));
                            }else{
                                
                                req.exp = additionExp;
                                next();
                            }
                        })
                        
                        
                        

                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })
            
    
        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
    },
    getbyStudent : (req,res) => {
        try {
            var id = req.query._id;

            Task.find({student_id : id}).exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002)); 
                }else{
                    if(result.length > 0){
                        res.status(200).json(result[0])
                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })

        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
    },
    getAll :(req,res) => {
        try {
            Task.find({}).exec((err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002)); 
                }else{
                    if(result){
                        res.status(200).json(result)
                    }else{
                        res.status(404).json(util.getMsg(40401));
                    }
                }
            })
        } catch (error) {
            res.status(400).json(util.getMsg(40401));
        }
    }

    
}





