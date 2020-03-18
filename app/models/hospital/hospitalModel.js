const moongoose = require('mongoose');


const Schema = moongoose.Schema;

let HospitalSchema = new Schema({
    hospitalName : {type:String,required:true},
    hosptalAddress : {type:String,required:true}
});

module.exports = moongoose.model('Hospital',HospitalSchema,'Hospital');

