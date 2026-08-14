//
const EventEmitter=require('events');
class MyEvent extends EventEmitter{

};
const events=new MyEvent();
events.on("greet",()=>{
    console.log('hello CSE 24 my name is ${name}');   //template literals     - `${var}`
})
events.on("exit",()=>{})
events.emit("greet","Rihan");
events.emit("exit");