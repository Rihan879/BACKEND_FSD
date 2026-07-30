//event loop concept
//create one synchronous function
//in settimeout make two promise 
// use call back fnc

console.log("synchronous task");

const f1=()=>{

}
const f2=()=>{
    console.log("f2");
}

function main(){
    console.log("this event loop");
    setTimeout(f1,1000);
    setTimeout(f2,1000);
    new Promise((resolve,reject)=>{
        resolve("i am promise1")
    }).then((result)=>{
        console.log(result);
    })
    new Promise((resolve,reject)=>{
        resolve("this is promise2")
    }).then((res)=>{
        console.log(res);
    })
}
f2();
main()