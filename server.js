import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";


const app = express();
const port= 5050;
const __dirname=dirname(fileURLToPath(import.meta.url));
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));


app.get('/',(req,res)=>{
    res.render('index.ejs')
})





app.listen(port,(err)=>{
    if (err) {
        console.log('Error laude')
    }else{
        console.log('Listening at port 5050')
    }
    
})