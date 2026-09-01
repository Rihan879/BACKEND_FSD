import express from 'express';
const app = express();
app.use(express.json());
let users=[
    {id: 1 , name:"Rihan", email: "abc@gmail.com"}
];

app.get('/user',(req,res)=>{
    res.json(users);
})

app.post('/user',(req,res)=>{
const user={
    id:users.length+1,
    name:req.body.name,
    email:req.body.email
};
users.push(user);
res.json(user);
})
app.listen(8000,()=>{
    console.log('server is running on port 8000');
})