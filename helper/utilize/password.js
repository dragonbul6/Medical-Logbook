const bcrypt = require('bcryptjs');

exports.encoded = (msg,cb) => {

        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(msg,salt,(err,hash) => {
                if(err){
                    console.log(err)
                }else{
                    cb(hash)
                }
            })
        })
}