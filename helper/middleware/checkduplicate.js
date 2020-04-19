

const UserSchema = require('../../app/models/user/ีuserModel');
const util = require('../../config/message');



module.exports = {
    checkDuplicateStudentId : (req,res,next) => {
        try {
            var student_id = req.body.student_id;
            var id = req.query._id;

            UserSchema.findById(id,(err,result) => {
                if(err){
                    console.log(err);
                    res.status(500).json(util.getMsg(50002));
                }else{
                    
                    if(result.advisorInfo.advisor_studentCase.length > 0){
                        var duplicate = student_id.filter((item) => result.advisorInfo.advisor_studentCase.indexOf(item) > -1);
                    var not_duplicate = student_id.filter((item) => result.advisorInfo.advisor_studentCase.indexOf(item) < -1);

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