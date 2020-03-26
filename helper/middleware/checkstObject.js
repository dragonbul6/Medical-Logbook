module.exports = {
    checkStudentId : (req,res,next) => {
        let {student_id} = req.body;
        if(student_id){
            next();
        }else{
            res.json({msg: "Request doesn't have ObjectId"});
        }

    }
}