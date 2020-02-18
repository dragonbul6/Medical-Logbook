const express = require('express'); 
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes')
const dbConnection = require('./helper/db')

const PORT = process.env.PORT || 3000

//Middleware
const middleware = require('./helper/middleware/checkAuth')

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.get('/',middleware.verifyToken,(req,res)=>{
 res.json({"msg" : "Authenticated"});
});

userRoutes(app)
dbConnection();

app.listen(PORT, ()=>{ 
    console.log('[Server] Node server listening on '+PORT);
});