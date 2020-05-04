const mongoose  = require('mongoose');

const Schema = mongoose.Schema();

var defaultTasks = {task : 'get approve case by advisor',quantity:5,exp:2};


var AchievementSchema = new Schema({
    student_id  : {type:Schema.Types.ObjectId , ref:'User', required : true},
    tasks : {type : Array , defualt : [defaultTasks]}
});

module.exports = moongoose.model('Achievement',AchievementSchema,'Achievement');