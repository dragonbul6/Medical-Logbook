const {Expo} = require('expo-server-sdk');

let expo = new Expo();
const PUSHTOKEN = [];


 function pushNotification(token){
        
        let messages = [];

        
        PUSHTOKEN.push(token);

        //ตรวจว่า token ที่ได้รับมานั้นใช่ตัวที่ expo ต้องการมั้ย?
        for(let pushToken of PUSHTOKEN){
            if(!Expo.isExpoPushToken(pushToken)){
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }

            //body format ของตัว expo เอง
            messages.push({
                to: pushToken,
                sound: 'default',
                body: 'This is a test notification',
                data: { withSome: 'data' },
            });
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
        pushNotification : (req,res) => {
            
            let {token} = req.body;
            
            pushNotification(token);
            
        }
    }


