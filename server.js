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
import multer from "multer";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';

const { json } = pkg;
dotenv.config()
const app = express() ;
const port =process.env.PORT || 5000;
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.json())
app.use(session({ secret: 'halwaaaabhengan102001200120001', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());




const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

const storage = multer.memoryStorage(); // Save the file in memory as a Buffer
const upload = multer({ storage: storage });


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.suqnipw.mongodb.net/LoginRegDB`)
// Assuming you have already set up your Express app and session middleware
// ...

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.userId) {
      // User is logged in, proceed to the next middleware or route handler
      next();
    } else {
      // User is not logged in, redirect to the login page or send an unauthorized response
      res.redirect('/login'); // You can replace '/login' with the path to your login page
      // Alternatively, you can send an unauthorized response like res.status(401).send('Unauthorized');
    }
  };
  //passport config
  
// Passport configuration
passport.use(new LocalStrategy({
    usernameField: 'email', // Use 'email' as the username field
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const user = await Registration.findOne({ email:email });
      console.log(user.email);
      if (!user || !user.verifyPassword(password)) {
        return done(null, false, { message: 'Invalid email or password' });
      }
  
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
  
//for passport to authenticate and set email as unique id

passport.serializeUser((user, done) => {
    done(null, user.email); // Use email as the unique identifier
  });
  
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await Registration.findOne({ email:email });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });



app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get("/p1",requireLogin,(req,res)=>{
    res.render("portfolio-1/p-1index.ejs",{
        title:"Portfolio",
        name: "Mahesh DAlle",
        skillarray:["mike","lassun"]

    })
})
app.get("/p2",requireLogin,(req,res)=>{
    res.render("portfolio-2/p-2index.ejs")
})

app.get("/p3",requireLogin,(req,res)=>{
    res.render("portfolio-3/p-3index.ejs")
})


app.get("/addinfo",requireLogin,(req,res)=>{
    res.sendFile(__dirname + "/views/addinfo.html")
})


const BasicSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String
    },
    skills:{
        type:[String],
        requred:true
    },
    projects:{
        type:[String],
        requred:true
    },
    experience:{
        type:[String],
        requred:true
    }

    
})
const Basic = mongoose.model("BasicInfo",BasicSchema)



app.post("/addbasic", upload.single('files'), async (req, res) => {
    const { title, name, about, hello } = req.body;
    const imageBuffer = req.file.buffer;
    
    // const user = await Registration.findOne({ email:user_email });

    // if (user) {
    //   // Update associated data for the user
    //   user.associatedData = newData;

    //   // Save the updated user
    //   await user.save();

    const userinfo = new Basic({
        name: name,
        title: title,
        about: about,
        image: { data: imageBuffer, contentType: req.file.mimetype }
    })
    userinfo.save()
    res.redirect("/template")

})


app.get("/template",(req,res)=>{
    res.sendFile(__dirname+"/views/templpage.html")
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
    password:String,
    associatedData:Object
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
        
        const {name,email,password,associatedData} = req.body
        const exist = await Registration.findOne({ email:email })

        const hashpass= await bcrypt.hash(password,10)
        if (!exist)  {const user = new Registration ({
                name:name,
                email:email,
                password: hashpass,
                associatedData:associatedData})
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
    const lurl =req.get('Referer') || '/';
    const { username, email,password} = req.body;
    var user_email=email
    const exist = await Registration.findOne({email:email})

    const newpass=await bcrypt.compare(password, exist.password)
    if (exist && newpass) {
      req.session.userId = exist._id;
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo; // Clear the stored URL
      res.redirect(redirectTo);
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error during login' + " boskdi");
  }
});

// app.post('/login', async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       const user = await User.findOne({ username });
  
//       if (user && (await bcrypt.compare(password, user.password))) {
//         req.session.userId = user._id;
//         res.status(200).send('Login successful');
//       } else {
//         res.status(401).send('Invalid credentials');
//       }
//     } catch (error) {
//       res.status(500).send('Error during login');
//     }
//   });



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



  