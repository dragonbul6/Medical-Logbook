

const UserSchema = require('../../app/models/user/ีuserModel');
const util = require('../../config/message');



module.exports = {
    checkDuplicateStudentId : (req,res,next) => {
        try {
            var student_id = req.body.student_id;
            var id = req.query._id;
            console.log(student_id)
            UserSchema.findById(id,(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    
                    if(result.advisorInfo.advisor_studentCase.length > 0){
                        var duplicate = []
                        var not_duplicate = []

                        for (const stId of student_id) {
                            for (const adId of result.advisorInfo.advisor_studentCase) {
                                if(stId == adId){
                                    duplicate.push(stId)
                                }else{
                                    not_duplicate.push(stId)
                                }
                            }
                        }
                        console.log(not_duplicate)

                        req.body.student_id = not_duplicate;
                   
                   
                    if(duplicate.length > 0){
                        console.log(`Duplicate_ID : ${duplicate}`);   
                    }
                    }

                    next();
                    
                }
            })
        } catch (error) {
            res.status(403).json(util.getMsg(40300));
        }
    }
};