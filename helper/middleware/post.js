
var msg = require('../../config/message');
var User = require('../../app/models/user/ีuserModel');


exports.pushNotify = (req,res) => {
    try {
        var name = req.profile.studentInfo.student_advisor;
        
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
                        res.status(200).json(msg.getMsg(200));
                    }else{
                        console.log(`advisor not recieve notification`);
                        res.status(200).json(msg.getMsg(200));
                    }
                    
                } catch (error) {
                    var msge = msg.getMsg(200);
                    msge.description = "ทำรายการเรียบร้อย และอาจารย์ไม่ได้เปิดใช้งาน notifcation"
                    res.status(200).json(msge);
                    console.log("[Expo-push_notification]",msg.getMsg(40401));
                }
                
            }  
 
        })
        
       } catch (error) {
           res.status(403).json(msg.getMsg(40302));
       }
}