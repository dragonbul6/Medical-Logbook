const User = require('../../app/models/user/ีuserModel');
const alertFunction = require("../../app/controller/Notification/Notification")
module.exports = {
    getAdvisorbystudentId : (student_id,callback) => {
        User.findById(student_id,async (err,result) => {
            if(err){
                console.log(err);
            }        
            let advisor = result.studentInfo.student_advisor;

            callback(advisor);

        });
    },
    getDeviceToken : (name) => {
        User.findOne({"advisorInfo.advisor_name" : name})
        .select("advisorInfo")
        .exec((err,result) => {
            if(err){
                console.log(err)
            }else{
                if(result.advisorInfo.receiving){
                    alertFunction.push(result.advisorInfo.deviceToken);
                }  
            }  
 
        })
        
    }
}