const jwt = require('jwt-simple')
const Indicator = require('../../config/keyJWT')
const UserSchema = require('../../app/models/user/ีuserModel')



module.exports = {
    verifyToken: (req,res,nex)=>{
        let token = req.headers["token"];
    
        if(!token){
            return res.status(401).json({ auth: false, message: 'No token provided.' });
        }else{
            let decoded = jwt.decode(token,Indicator.KEY);
            
            UserSchema.findOne({username:decoded.id},(err,doc) => {
                if(err) return res.status(500).send("There was a problem finding the user.");
                if(!doc) return res.status(404).send("No user found.");
                
            })
    
            nex();
    
        }
    
        
    }
};