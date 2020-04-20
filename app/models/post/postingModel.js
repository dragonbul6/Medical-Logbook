const moongoose = require('mongoose');
const Schema = moongoose.Schema;
const moment = require('moment');

let PostingSchema = new Schema({
    poster : {type:String,default:null},
    student_id : {type:String,required:true},
    approval : {type:Boolean,default:false},
    PatientProfile : {
        name : {type:String,default:null},
        HN : {type:String,default:null},
        Age : {type:Number,default:null},
    },
    Examination : {type:String,default:null},
    currentTime : {type: String,default: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")},
    Date : {type:Date,default:Date.now},
    Diagnosis : {type:String,default:null},
    Category : {type:String,default:null},
    Problem_list : {type:String,default:null},
    Problem : {type:String,default:null},
    Discussion : {type:String,default:null},
    Location : {type:String,default:null},
    comment:[{type:Schema.Types.ObjectId, ref:'Comment'}]

});


PostingSchema.pre('findOneAndUpdate',function(next){
    
    this.currentTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    this.Date = new Date();
    next();
})

module.exports = moongoose.model('Posting',PostingSchema,'Post')
