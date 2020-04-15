const Notifications = require('../app/controller/Notification/Notification')
const helper = require('../helper/middleware/checkAuth')
module.exports = (app) => {

    const path = `/api/mobile/`;

    app.post(path+'pushNotification',helper.verifyToken,Notifications.EnableNotification);
}