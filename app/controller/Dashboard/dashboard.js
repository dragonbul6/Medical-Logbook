const hospital = require('../../models/hospital/hospitalModel');
const msg = require('../../../config/message');


 function getRatio(object,name) {
    var case_amount = object.length;
    var result = {};

    if(case_amount !== 0){
        var problemArr = [];
        var countArr = [];
        result.hospital_name = name;
        object.map((item) => problemArr.push(item.Problem.name));

        problemArr.map((item,index) => {
            countArr[index] = countCase(object,item);
        });

        var problem = []
    
        problemArr.filter((item,i) => problemArr.indexOf(item) === i).map((item,index) => {
        var value =  {name:  item , ratio : Number( (countArr[index]/case_amount).toFixed(2) )}
        problem.push(value);
        });

        result.problem = problem;
        
        
    }else{
        result.name = name;
        result.problem = null;
    }
    
    
    return {result , problemArr};
}

function countCase(object,name) {
    
    var temp = object.filter((item) => item.Problem.name == name);
    
    return temp.length;

}

function mergeAndcount(arr) {
    
    var temp = [];
    

    for (let x = 0; x < arr.length; x++) {

        var length = arr[x].length;
       
        for (let y = 0; y < length; y++) {
            
            temp.push(arr[x][y]);
            
        }
        
    }

    var result = []
    temp.filter((item,index) => temp.indexOf(item) === index).map((item) => {
        result.push(Object.assign({name:item , ratio : Number( (temp.filter((el) => el === item).length / temp.length).toFixed(2) ) }))
    })

    return result;
}





exports.DashboardInfo_All = (req,res) => {
    
    hospital.find({})
    .populate({
        path : 'postList',
        populate : [{path:'Category'},{path:'Problem'}]
    })
    .exec(function (err,result) {
        if(err){
            console.log(err);
            res.status(500).json(msg.getMsg(50002));
        }else{ 
            if(result){

                var chunkRatio = [];
                var allCase = [];

                result.forEach(value => {
                    var name = value.hospitalName;
                    var cases = value.postList;
                    if(cases.length > 0){
                        var obj = getRatio(cases,name);
                       chunkRatio.push(obj.result);
                       allCase.push(obj.problemArr);
                    }
                });

                

                var allRatio = mergeAndcount(allCase);

                var chunk = msg.getMsg(200);
                chunk.data = {specific:chunkRatio,all:allRatio};
                res.status(200).json(chunk);

            }else{
                res.status(404).json(msg.getMsg(40401));
            }
            
        }
    })
}