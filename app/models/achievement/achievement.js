const mongoose = require('mongoose');

const Schema = mongoose.Schema;




var AchievementSchema = new Schema({
    student_id  : {type:Schema.Types.ObjectId , ref:'User'},
    tasks : {type : Array ,default:[]}
});

module.exports = mongoose.model('Achievement',AchievementSchema,'Achievement');