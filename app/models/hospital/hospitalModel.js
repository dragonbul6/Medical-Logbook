const moongoose = require('mongoose');


const Schema = moongoose.Schema;

let HospitalSchema = new Schema({
    hospitalName : {type:String,required:true},
    hospitalAddress : {type:String,required:true},
    studentList : [{type:Schema.Types.ObjectId , ref:'User'}],
    postList : [{type:Schema.Types.ObjectId , ref:'Posting'}]
});

module.exports = moongoose.model('Hospital',HospitalSchema,'Hospital');

