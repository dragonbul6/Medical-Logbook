const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DiagnosisSchema = new Schema({
    name:{type:String,required:true},
    capacity:{type:Number,default:0},
    Status:{type:Boolean,default:false}
});

module.exports = mongoose.model('Problems',DiagnosisSchema,'Problems');