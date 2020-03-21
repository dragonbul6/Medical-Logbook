const moongoose = require('mongoose');
const Schema = moongoose.Schema;

let PostingSchema = new Schema({
    Patient : {
        name : {type:String,require:true},
        HN : {type:String,require:true},
        Age : {type:Number,require:true},
        Nationality : {type:String,default:"-"},
        Religion : {type:String,default:"-"},
        Informant : {type:String,default:"-"},
        Reliability : {type:String,default:"-"},
        Complaint : {type:String,default:"-"},
        now_illness : {type:String,default:"-"},
        past_history : {type:String,default:"-"},
        Family_history : {type:String,default:"-"}        
    },
    Examination : {
        currentTime : {type: Date,default: Date.now},
    }

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

module.exports = moongoose.model('Posting',PostingSchema,'Posting')