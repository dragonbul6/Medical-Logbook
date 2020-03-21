const Category = require('../../models/problems/category');

module.exports = {
    create: (req,res) => {
        let data = req.body;
        let category = new Category(data);

        category.save((err,doc) => {
            if(err){
                res.status(400).json({status:false,message:err});
            }else{
                res.status(200).json({status:true,message:"Category has added",data:doc});
            }
        });
    },
    update: (req,res) => {
        let date = req.body;
        let pId = req.query._id;

        Category.findByIdAndUpdate(pId,date,(err,doc) => {
            if(err){
                res.status(400).json({msg:err});
            }else{
                res.status(200).json({msg:"Category has update"});
            }
        });
    },
    delete : (req,res) => {
        let pId = req.query._id;

        Category.findByIdAndDelete(pId,(err,doc) => {
                if(err){
                    res.status(400).json({msg:err});
                }
                res.status(200).json({msg:'delete '+doc._id});
        });
    },
    getAll : (req,res) => {
        Category.find({},(err,doc) => {
            if(err){
                res.json({status:false,msg:err});
            }
            res.status(200).json(doc);
        });
    },
    getOne : (req,res) => {
        let pId = req.query._id;

        Category.findById(pId,(err,doc) => {
            if(err){
                res.json({status:false,msg:err})
            }

            res.status(200).json(doc)
        });
    },
    GetArray : (req,res) => {
       let arrayItem = [];
        Category.find({},(err,doc) => {
            if(err){
                res.json({status:false,msg:err});
            }
            doc.map((item) => arrayItem.push(item.CategoryName))

            res.status(200).send(arrayItem);
        });
    }
}
