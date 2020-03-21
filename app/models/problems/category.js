const moongoose = require('mongoose');


const Schema = moongoose.Schema;

let Category = new Schema({
    CategoryName : {type:String,required:true},
});

module.exports = moongoose.model('Category',Category,'Category');

