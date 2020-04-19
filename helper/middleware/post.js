var helper = require('../../app/controller/Notification/Notification')
var msg = require('../../config/message');
var User = require('../../app/models/user/ีuserModel');


exports.pushNotify = (req,res) => {
    try {
        var id = req.profile.studentInfo.student_advisorId;
        
        User.findById(id)
        .select("advisorInfo")
        .exec((err,result) => {
            if(err){
                console.log(err)
            }else{
                try {                 
                    var status = result.advisorInfo.receiving;
                    if (status) {
                        var token = result.advisorInfo.deviceToken;
                        var id = req.body.newPostId;
                        helper.pushNotification(token,id);
                        res.status(200).json(msg.getMsg(200));
                    }else{
                        console.log(`Advisor not recieve notification`);
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