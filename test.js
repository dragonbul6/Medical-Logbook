
function berry(){
    console.log('another function');
}

function apple() {
    console.log('insind function');

    setTimeout(()=>console.log('in timeout'),0)

    new Promise((resolve,reject) => resolve('in promise'))
    .then((value) => console.log(value))
    
    berry();
}

apple();
