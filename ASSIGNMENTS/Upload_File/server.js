import express from 'express';
import multer from 'multer';
const app=express();
app.use(express.static('public'));
const upload=multer({dest:'upload/'});
app.post('/upload',upload.single('file'),(req,res)=>{
    console.log(req.file);
    res.send("File Uploaded");
});
app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
});