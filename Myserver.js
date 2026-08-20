//create my own server using http module
import http from "http";
const server=http.createServer((req,res)=>{

})
server.listen(8000,()=>{
    console.log("server is running on port 8000");
})
