const moongoose = require('mongoose');


const Schema = moongoose.Schema;

let HospitalSchema = new Schema({
    hospitalId : {type:Number,required:true},
    hospitalName : {type:String,required:true},
    hosptalAddress : {type:String,default:null}
})

module.exports = moongoose.model('Hospital',HospitalSchema,'Hospital');

