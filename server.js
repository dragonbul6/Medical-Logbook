const express = require('express'); 
const bodyParser = require('body-parser');
const dbConnection = require('./helper/db')
const cors = require('cors')

//static
const PORT = process.env.PORT || 3000

//Middleware
const middleware = require('./helper/middleware/checkAuth')

//routes 
const userRoutes = require('./routes/userRoutes')
const hospitalRoutes = require('./routes/hospitalRoutes');


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/',middleware.verifyToken,(req,res)=>{
 res.json({"msg" : "Authenticated"});
});

userRoutes(app);
hospitalRoutes(app);

dbConnection();

app.listen(PORT, ()=>{ 
    console.log('[Server] Node server listening on '+PORT);
});