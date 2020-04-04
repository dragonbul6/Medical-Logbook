const moongoose = require('mongoose');
const Schema = moongoose.Schema;

let PostingSchema = new Schema({
    student_id : {type:String,required:true},
    approval : {type:Boolean,default:false},
    PatientProfile : {
        name : {type:String,required:false},
        HN : {type:String,required:false},
        Age : {type:Number,required:false},
    },
    Examination : {type:String,default:null},
    currentTime : {type: Date,default: Date.now},
    Diagnosis : {type:String,required:false},
    Category : {type:String,required:false},
    Problem_list : {type:String,default:null},
    Problem : {type:String,required:false},
    Discussion : {type:String,default:null},
    comment:[{type:Schema.Types.ObjectId, ref:'Comment'}]

});

PostingSchema.pre('save',function(next){
    now = new Date();
    this.currentTime = now;

    next();
});

PostingSchema.pre('findOneAndUpdate',function(next){
    now = new Date();
    this.currentTime = now;
    next();
})

module.exports = moongoose.model('Posting',PostingSchema,'Post')
