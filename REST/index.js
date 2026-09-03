import express from 'express';
const app=express();
app.use(express.json());
let users=[
    {id:1,name:"Rihan",email:"rihan@gmail.com"},
    {id:2,name:"saifi",email:"saifi@gmail.com"}
];

//Get:get request to fetch all users
app.get('/users',(req,res)=>{
    res.json(users);
})

//Post:post  request to crate a new user
app.post('/users',(req,res)=>{
    const user={
        id:users.length+1,
        name:req.body.name,
        email:req.body.email
};
users.push(user);
res.json(user);  
})
app.listen(8000,()=>{
    console.log("server is running on port: https://localhost:8000 ")
});