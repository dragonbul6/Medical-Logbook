const jwt = require('jwt-simple')
const Indicator = require('../../config/keyJWT')
const UserSchema = require('../../app/models/user/ีuserModel')



module.exports = {
    verifyToken: (req,res,nex)=>{
        let token = req.headers["token"];
    
        if(!token){
            return res.status(401).send(`<h1>ไม่มี token </h1><br><br/><h2>1. /api/create สมัคร แนบ username,password ใน body</h2>
            <h2>2. /api/login เข้าระบบ แนบบ username,password ผ่าน body ถ้าผ่านจะได้ token แล้วเอาไปยัดใส่ใน headers ตั้งชื่อตัวแปรว่า token<br></br>
            <h2>3. ลองเข้า main route นั้นคือ / `);
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