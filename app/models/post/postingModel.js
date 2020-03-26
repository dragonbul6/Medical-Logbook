const moongoose = require('mongoose');
const Schema = moongoose.Schema;

let PostingSchema = new Schema({
    student_id : {type:String,required:true},
    PatientProfile : {
        name : {type:String,required:false},
        HN : {type:String,required:false},
        Age : {type:Number,required:false},
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
        category : {
            vitalsign : {
                temp : {type:String,default:"-"},
                pulse : {type:String,default:"-"},
                bloodPressure :{type:String,default:"-"},
                respiratory : {type:String,default:"-"},
                weight : {type:Number,default:0},
                height : {type:Number,default:0} 
            },
            systemic : {
                head : {type:String,default:"-"},
                cvs : {type:String,default:"-"},
                abs : {type:String,default:"-"},
                respiratory : {type:String,default:"-"},
                msk : {type:String,default:"-"},
                neuro : {type:String,default:"-"}
            },
            specialtest : {type:String,default:"-"},
            investigate : {type:String,default:"-"}
        }
    },
    Problem_Diagnosis : {
        Problem : {type:String,required:false},
        Diagnosis : {type:String,required:false}
    },
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
