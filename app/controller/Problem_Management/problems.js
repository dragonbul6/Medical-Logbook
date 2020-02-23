const Problems = require('../../models/problems/diagnosis');

module.exports = {
    create : (req,res) => {
        let data = req.body;

        let problems = new Problems(data);

        problems.save((err,doc) => {
            if(err){
                res.status(400).json({status:false,message:err});
            }else{
                res.status(200).json({status:true,message:"Problem has added",data:doc});
            }
        });
    },
    update : (req,res) => {
        let data = req.body;
        let pId = req.query._id;

        Problems.findByIdAndUpdate(pId,data,(err,doc) => {
            if(err){
                res.status(400).json({msg:err});
            }else{
                res.status(200).json(doc);
            }
        });
    },
    delete : (req,res) => {
        let pId = req.query._id;

        Problems.findByIdAndDelete(pId,(err,doc) => {
                if(err){
                    res.status(400).json({msg:err});
                }
                res.status(200).json({msg:'delete '+doc._id});
            
        });
    },
    getAll : (req,res) => {
        Problems.find({},(err,doc) => {
            if(err){
                res.json({status:false,msg:err});
            }
            res.status(200).json(doc);
        });
    },
    getOne : (req,res) => {
        let pId = req.query._id;

        Problems.findById(pId,(err,doc) => {
            if(err){
                res.json({status:false,msg:err})
            }

            res.status(200).json(doc)
        })
    }
    
}