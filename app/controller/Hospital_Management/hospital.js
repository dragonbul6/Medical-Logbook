const Hospital = require('../../models/hospital/hospitalModel');

module.exports = {
    create : (req,res,next)=>{
        let data = req.body;

        let hospital = new Hospital(data);
        
        hospital.save((err,result) => {
            if(err){
                next(err);
            }else{
                res.status(200).json({status:true,message:"Hospital added"});
            }
        })

    },
    update : (req,res) => {
        let data = req.body;
        let hosid = req.query._id;

        Hospital.findByIdAndUpdate(hosid,data,(err,doc) => {
            if(err){
                res.status(400).json({msg:'Have an error'});
            }else{
                res.status(200).json(doc);
            }
        })
    },
    delete : (req,res) => {
        let hosid = req.query._id;

        Hospital.findByIdAndDelete(hosid,(err,doc) => {
                if(err){
                    res.status(400).json({msg:'not found'});
                }
                res.status(200).json({msg:'delete '+doc._id})
            
        })
    },
    getall : (req,res) => {
        Hospital.find({},(err,doc) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }
            res.status(200).json(doc)
        })
    },
    getSpecific : (req,res) => {
        let hosid = req.query._id;;

        Hospital.findById(hosid,(err,doc) => {
            if(err){
                res.status(400).json({msg:'not found'});
            }
            res.status(200).json({msg:'delete '+doc._id})
        })
    }

};