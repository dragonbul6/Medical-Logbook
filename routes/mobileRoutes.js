const Notifications = require('../app/controller/Notification/Notification')

module.exports = (app) => {

    const path = `/api/mobile/`;

    app.post(path+'pushNotification',Notifications.EnableNotification);
}