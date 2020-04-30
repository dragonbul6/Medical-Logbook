const controller = require('../app/controller/Dashboard/dashboard')

module.exports = (app) => {
    const path = `/api/dashboard/`;

    app.get(path,controller.DashboardInfo_All);
    
}