import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose, { Schema, mongo } from "mongoose";
import { strict } from "assert";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import pkg from 'body-parser';





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



mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.suqnipw.mongodb.net/LoginRegDB`)



app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get("/p1",(req,res)=>{
    res.render("/portfolio-1/index.ejs",{resume:url("public/images/img1.png")})
})
app.get("/p2",(req,res)=>{
    res.render("/portfolio-2/index.ejs")
})

app.get("/p3",(req,res)=>{
    res.render("/portfolio-3/index.ejs")
})






//model for mongoose

// const regscema=new mongoose.Schema({
//     name:String,
//     email:String,
//     password:String
// })

// const Registration = mongoose.model("Regsitration",regscema)


//mongoose testing 

// const fruitshema = new Schema ({
//     name:String,
//     rating:Number
// })

// const Fruit = mongoose.model("Fruit",fruitshema)

// const fruit1= new Fruit({name:"mahesh" ,rating:9 })
// fruit1.save()

const regscema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const Registration = mongoose.model("Regsitration",regscema)

app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/views/success.html")
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/views/error.html")
})
app.get("/register",(req,res)=>{
    res.render("regist.ejs")
})

app.post("/register",async (req,res)=>{ 
    try {
        
        const {name,email,password} = req.body
        const exist = await Registration.findOne({email:email})
        if (!exist)  {
                const user = new Registration ({
                name:name,
                email:email,
                password:password
        })      
                await user.save()
                res.redirect("/success")}
        else {
            await res.render("regist.ejs",{alreadyexist:true})

        }
         
        
        
    } catch (error) {
        res.redirect("/error")
    }
})
  


app.listen(port,(err)=>{
    if (err) {
        console.log('Error sir')
    }else{
        console.log(`Listening at port ${port}`)
    }
    
})