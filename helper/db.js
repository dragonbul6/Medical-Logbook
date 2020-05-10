const mongoose = require('mongoose')
const config = require('../config/config')


module.exports = ()=>{
    mongoose.connect(config.mongoURL,config.options,(err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("[DB] Connected to : "+config.host)
        }
    });

}