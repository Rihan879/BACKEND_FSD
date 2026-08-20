



const emitter=new EventEmitter();
emitter.on("click",()=>{
     console.log("click event triggered");

});
emitter.on("mouseover",()=>{
    console.log("mouseover event triggered");
});
emitter.emit('click');
emitter.emit('mouseover');
