const {Expo} = require('expo-server-sdk');
const User = require('../../models/user/ีuserModel');
const msg = require('../../../config/message')
let expo = new Expo();



 exports.pushNotification = (token,id) => {
        
    
        let messages = [];
        let PUSHTOKEN = token;
        
        
        
        //ตรวจว่า token ที่ได้รับมานั้นใช่ตัวที่ expo ต้องการมั้ย?
        for(let pushToken of PUSHTOKEN){
            if(!Expo.isExpoPushToken(pushToken)){
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            //body format ของตัว expo เอง
            
            if(id == void 0){
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    body: 'ทดสอบระบบ Notification',
                    data: { withSome: 'data' },
                });
            }else{
                messages.push({
                    to: pushToken,
                    sound: 'default',
                    body: 'มีคน post: '+id,
                    data: { withSome: 'data' },
                });
            }
            
        }

        let chunks = expo.chunkPushNotifications(messages); //สร้างก้อนที่มี message บรรจุ
        let tickets = [];
        //ส่ง ก้อนๆนั้น เข้าสู่ expo server
        (async () => {
            for(let chunk of chunks){
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log(ticketChunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.log(error)
                }
            }
        })();

        let receiptIds = [];
        for(let ticket of tickets){
            if(ticket.id){
                receiptIds.push(ticket.id);
            }
        }

        let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
        (async () => {
            for (let chunk of receiptIdChunks) {
                try {
                let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
                console.log(receipts);
            
                // The receipts specify whether Apple or Google successfully received the
                // notification and information about an error, if one occurred.
                for (let receipt of receipts) {
                    if (receipt.status === 'ok') {
                    continue;
                    } else if (receipt.status === 'error') {
                    console.error(`There was an error sending a notification: ${receipt.message}`);
                    if (receipt.details && receipt.details.error) {
                        // The error codes are listed in the Expo documentation:
                        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                        // You must handle the errors appropriately.
                        console.error(`The error code is ${receipt.details.error}`);
                    }
                    }
                }
                } catch (error) {
                console.error(error);
                }
            }
        })();



    }

    module.exports = {
        EnableNotification : (req,res) => {
            
            try {
                var token = req.body.token;
                var _id = req.profile._id;
            User.findById(_id,(err,user) => {
                if(err){
                    res.status(400).json(err)
                }
                let arr = user.advisorInfo.deviceToken;
                if(arr.length > 0){
                    for (const i of arr) {
                        if(i !== token){
                            arr.push(token);
                        }
                    }
                }else{
                    arr.push(token);
                }

                user.updateOne({"advisorInfo.deviceToken" : arr,"advisorInfo.receiving" : true},(err,doc) => {
                    if(err){
                        console.log(err)
                    }
                });

                exports.pushNotification(arr,null);
            
            });
            } catch (error) {
                res.status(403).json(msg.getMsg(40300));
            }
            
            
        },
        push : (req,res) => {

            var id = req.body.id;
            var token = req.body.token;

            res.status(200).json(msg.getMsg(200));
            exports.pushNotification(token,id)
            
            
        }
    }

