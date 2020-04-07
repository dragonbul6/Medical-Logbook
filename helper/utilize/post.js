const User = require('../../app/models/user/ีuserModel');
const alertFunction = require("../../app/controller/Notification/Notification")
const msg = require('../../config/message');
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
                try {
                    
                    var status = result.advisorInfo.receiving;
                    if (status) {
                        var token = result.advisorInfo.deviceToken;
                        alertFunction(token);
                    }else{
                        console.log(`advisor not recieve notification`);
                    }
                    
                } catch (error) {
                    console.log("[Expo-push_notification]",msg.getMsg(40401));
                }
                
            }  
 
        })
        
    }
}