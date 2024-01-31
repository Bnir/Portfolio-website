import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";




const { json } = pkg;
dotenv.config()
const app = express() ;
const port =process.env.PORT || 5000;
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(bodyParser.json())
const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD



mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.izhprbz.mongodb.net/registDB-Portfolio-gen`)



app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get("/p1",(req,res)=>{
    res.render("/portfolio-1/index.ejs")
})


app.listen(port,(err)=>{
    if (err) {
        console.log('Error laude')
    }else{
        console.log('Listening at port 5050')
    }
    
})