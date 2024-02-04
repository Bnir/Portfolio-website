import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose, { Schema, mongo } from "mongoose";
import { strict } from "assert";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import pkg from 'body-parser';
import bcrypt from "bcrypt"
import session from 'express-session';



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
    res.render("portfolio-1/p-1index.ejs",{
        title:"Rahul Banger",
        name: "Saketh Parimi",
        skillarray:{
            skill_name:"web dev",
            skill_info:"Its been a long dayyy "
           }

    })
})
app.get("/p2",(req,res)=>{
    res.render("portfolio-2/p-2index.ejs")
})

app.get("/p3",(req,res)=>{
    res.render("portfolio-3/p-3index.ejs")
})


app.get("/addinfo",(req,res)=>{
    res.sendFile(__dirname + "/views/addinfo.html")
})

const BasicSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    }
    
})
const Basic = mongoose.model("BasicInfo",BasicSchema)


app.post("/addbasic",(req,res)=>{
    const {title,name,about} = req.body
    const userinfo = new Basic({
        name:name,
        title:title,
        about:about
    })
   userinfo.save()
    console.log(name,title,about)

    })  



//
// var popupS = require('popups');
 
// popupS.alert({
//     content: 'Hello World!'
// });


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
        const exist = await Registration.findOne({ email:email })
        console.log(exist+"hitaa");
        const hashpass= await bcrypt.hash(password,10)
        if (!exist)  {const user = new Registration ({
                name:name,
                email:email,
                password: hashpass})
                await user.save()
                res.redirect("/success")}
                
                
        else {
            await res.render("regist.ejs",{alreadyexist:true})

        }
         
        
        
    } catch (error) {
        res.redirect("/error")
        console.log(error);
    }
})
  


app.listen(port,(err)=>{
    if (err) {
        console.log('Error sir')
    }else{
        console.log(`Listening at port ${port}`)
    }
    
})





//login part

app.get("/login",(req,res)=>{
    res.sendFile(__dirname+ "/views/login.html")
})

app.use(session({ secret: 'lassunlaude', resave: true, saveUninitialized: true }));



// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });


// app.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
//     res.status(201).send('User registered successfully');
//   } catch (error) {
//     res.status(500).send('Error registering user');
//   }
// });

  
// const {name,email,password} = req.body
// const exist = await Registration.findOne({ email:email })
// console.log(exist+"hitaa");
// const hashpass= await bcrypt.hash(password,10)
// if (!exist)  {const user = new Registration ({
//         name:name,
//         email:email,
//         password: hashpass})
//         await user.save()
//         res.redirect("/success")}
        
        
// else {
//     await res.render("regist.ejs",{alreadyexist:true})

// }
 

app.post('/login', async (req, res) => {
  try {
    const { username, email,password} = req.body;
    console.log(username,password,email)
    const exist = await Registration.findOne({email:email})

    if (exist && (await bcrypt.compare(password, exist.password))) {
      req.session.userId = user._id;
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error during login' + " boskdi");
  }
});

// app.post('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send('Error logging out');
//     } else {
//       res.clearCookie('connect.sid');
//       res.status(200).send('Logout successful');
//     }
//   });
// });
