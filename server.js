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
import { link } from "fs";



// import connectMongoDBSession from "connect-mongodb-session";

// Destructure the named export
// const { default: MongoDBStore } = connectMongoDBSession;

const { json } = pkg;
dotenv.config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@portfoliogen.emzz7tb.mongodb.net/portfolio`)
const app = express() ;
// const MongoDBStoreSession = MongoDBStore(session);

const storage = multer.memoryStorage(); // Save the file in memory as a Buffer
const upload = multer({ storage: storage });
const port =process.env.PORT || 5000;
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}))
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.json())

// const monguri = `mongodb+srv://${username}:${password}@cluster0.suqnipw.mongodb.net/LoginRegDB`
// const store = new MongoDBStore({
//   uri: monguri,
//   collection: 'sessions',
// });

app.use(session({ secret: 'halwaaaabhengan102001200120001', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 'halwaaaabhengan102001200120001',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: null }
}));



// const store = new RedisStore({
//   host: 'localhost',
//   port: 6379,
//   // Add additional options if needed
// });

// app.use(session({
//   secret: 'halwaaaabhengan102001200120001',
//   resave: false,
//   saveUninitialized: true,
//   store, // In ES6, you can directly use the variable name as a shorthand
// }));



// Assuming you have already set up your Express app and session middleware
// ...

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.email) {
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
      // const user = await Registration.findOne({ email:email });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });



app.get('/',(req,res)=>{
  if (req.session.email){
    res.render('index.ejs',{loggedin:true})
  }
  else{  
    res.render('index.ejs',{loggedin:false}) } 
})


app.get("/addinfo",requireLogin,(req,res)=>{
    const userEmail = req.session.email;
    console.log(userEmail);
    res.sendFile(__dirname + "/views/addinfo_2.html")
})



//skills inner scehma
const skillSchema = new Schema({
  skill_name: String,
  skill_info: String
});

//projects inner schema
const projectSchema = new Schema({
  project_name: String,
  project_info: String
});

//experience innner schema
const expSchema = new Schema({
  exp_name: String,
  exp_info: String
});


const BasicSchema = new Schema({
    email:{
      type: String,
      required: true,

    },
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
        skill1:skillSchema,
        skill2:skillSchema,
        skill3:skillSchema,
        skill4:skillSchema,
        skill5:skillSchema,
        skill6:skillSchema
    },
    projects:{
        proj_1:projectSchema,
        proj_2:projectSchema,
        proj_3:projectSchema,
        proj_4:projectSchema,
        proj_5:projectSchema,
        proj_6:projectSchema
    },
    experience:{
        exp_1:expSchema,
        exp_2:expSchema,
        exp_3:expSchema,
        exp_4:expSchema,
        exp_5:expSchema,
        exp_6:expSchema
    },
    links:{
      ilink:String,
      llink:String,
      xlink:String,
      flink:String

    }

    
})
const Basic = mongoose.model("Data_STORAGE",BasicSchema)

app.post("/addbasic", upload.single('image'), async (req, res) => {
    // var email=sessionStorage.getItem('useremail')
    console.log(req.body);
    const email=req.session.email
    const { title, name, about,skill1_name,skill1_info,
      skill2_name,skill2_info,
      skill3_name,skill3_info,
      skill4_name,skill4_info,
      skill5_name,skill5_info,
      skill6_name,skill6_info,
      project1_info,project1_name,
      project2_info,project2_name,
      project3_info,project3_name,
      project4_info,project4_name,
      project5_info,project5_name,
      project6_info,project6_name,
      exp1_name,exp1_info,
      exp2_name,exp2_info, 
      exp3_name,exp3_info,
      exp4_name,exp4_info,
      exp5_name,exp5_info,
      exp6_name,exp6_info
      ,ilink,xlink,flink,llink} = req.body;
      
     


    const imageBuffer = req.file.buffer;

 const userinfo = new Basic({
        email:email,
        name: name,
        title: title,
        about: about,
        image: { data: imageBuffer, contentType: req.file.mimetype},
        skills: {
          skill1: {
              skill_name: skill1_name,
              skill_info: skill1_info
          },
          skill2: {
            skill_name: skill2_name,
            skill_info: skill2_info
          },
          skill3: {
            skill_name: skill3_name,
            skill_info: skill3_info
          },
          skill4: {
            skill_name: skill4_name,
            skill_info: skill4_info
          },
          skill5: {
            skill_name: skill5_name,
            skill_info: skill5_info
          },
          skill6: {
            skill_name: skill6_name,
            skill_info: skill6_info
          }},
        projects:
        {
          proj_1: {
              project_name: project1_name,
              project_info: project1_info
          },
          proj_2: {
              project_name: project2_name,
              project_info: project2_info
          },
          proj_3: {
              project_name: project3_name,
              project_info: project3_info
          },
          proj_4: {
              project_name: project4_name,
              project_info: project4_info
          },
          proj_5: {
              project_name: project5_name,
              project_info: project5_info
          },
          proj_6: {
              project_name: project6_name,
              project_info: project6_info
          }},
        experience:{
          exp_1: {
              exp_name: exp1_name,
              exp_info: exp1_info
          },
          exp_2: {
              exp_name: exp2_name,
              exp_info: exp2_info
          },
          exp_3: {
              exp_name: exp3_name,
              exp_info: exp3_info
          },
          exp_4: {
              exp_name: exp4_name,
              exp_info: exp4_info
          },
          exp_5: {
              exp_name: exp5_name,
              exp_info: exp5_info
          },
          exp_6: {
              exp_name: exp6_name,
              exp_info: exp6_info
          }},
          links:{
            ilink:ilink,
            flink:flink,
            xlink:xlink,
            llink:llink
          }
    })


    await userinfo.save()
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
                associatedData:associatedData
                })
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
    res.render("login.ejs")
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
 

// app.post('/login', async (req, res) => {
//   try {
//     const lurl =req.get('Referer') || '/';
//     const { username, email,password} = req.body;
//     var user_email=email
//     const exist = await Registration.findOne({email:email})

//     const newpass=await bcrypt.compare(password, exist.password)
//     if (exist && newpass) {
//       req.session.userId = exist._id;
//       const redirectTo = req.session.returnTo || '/';
//       delete req.session.returnTo; // Clear the stored URL
//       res.redirect(redirectTo);
//       sessionStorage.setItem('useremail',email)
//     } else {
//       res.status(401).send('Invalid credentials');
//     }
//   } catch (error) {
//     res.status(500).send('Error during login');
//   }
// });

app.post('/login', async (req, res) => {
  try {
    const lurl = req.get('Referer') || '/';
    const { email, password } = req.body; // You're not using username here, so remove it from destructuring
    const user = await Registration.findOne({ email });
    

    if (user && (await bcrypt.compare(password, user.password))) {
      // req.session.userId = user._id;
      req.session.email = email;
      // console.log(req.session.email);
      // const redirectTo = req.session.returnTo || '/';
      // delete req.session.returnTo; // Clear the stored URL
      res.redirect("/");
      // sessionStorage.setItem('useremail', email);  
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
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



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send('Error logging out');
    } else {
      res.clearCookie('connect.sid');
      res.redirect("/");
    }
  });
});





app.get("/p1",requireLogin,async (req,res)=>{
  const user_email=req.session.email
  const data= await Basic.findOne({email:user_email})
 
  if (data) {
    const { title, name, about, skills,projects,experience,links} = data;
    // console.log(skills,projects,experience);
    const TITLE = data.title;
    const NAME = data.name;
    // const skill_number=[skill1,skill2,skill3,skill4,skill5,skill6]
    // const skill1_name=skills.skill1.skill_name;
    let skillArray=[]
    for (let index = 1; index <= 6; index++) {
      let skill = {};
      var skill_num = skills[`skill${index}`];
      if (skill_num.skill_name) {
        skillArray.push(skill_num);
      }
      //  else {
      //   console.log('invalid credi');
      // }
    }
    console.log(skillArray);
    let projectArray=[]
    for (let index = 1; index <= 6; index++) {
      var proj_num = projects[`proj_${index}`];
      if (proj_num.project_name) {
        projectArray.push(proj_num);
      }
      //  else {
      //   console.log('invalid credi');
      // }
    }

    console.log(projectArray);
    
    let expArray=[]
    for (let index = 1; index <= 6; index++) {
      
      var exp_num = experience[`exp_${index}`];
      if (exp_num.exp_name) {
        expArray.push(exp_num);
       }
       // else {
      //   console.log('invalid credi');
      // }
    }
    console.log(expArray);
    //link array
    // console.log(links.ilink)
    // const ilink={ilink:links.ilink};
    // const xlink={xlink:links.xlink};
    // const flink={flink:links.flink};
    // const llink={llink:links.llink};
    // const linkarray={ilink}
    const linkarray={ilink:links.ilink,xlink:links.xlink,flink:links.flink,llink:links.llink}
    console.log(linkarray.ilink);
    // console.log(skill1_name,name);
    await res.render("portfolio-1/p-1index.ejs", {
        title: title,
        name: name,
        skillArray: skillArray,
        projectArray:projectArray,
        experienceArray: expArray,
      links:linkarray})
  }else{
    console.log("data not found")
  }
})


app.get("/p2",requireLogin,async(req,res)=>{
  // res.render("portfolio-2/p-2index.ejs")
  const user_email=req.session.email
  const data= await Basic.findOne({email:user_email})
 
  if (data) {
    const { title, name, about, skills,projects,experience,links} = data;
    // console.log(skills,projects,experience);
    const TITLE = data.title;
    const NAME = data.name;
    // const skill_number=[skill1,skill2,skill3,skill4,skill5,skill6]
    // const skill1_name=skills.skill1.skill_name;
    let skillArray=[]
    for (let index = 1; index <= 6; index++) {
      let skill = {};
      var skill_num = skills[`skill${index}`];
      if (skill_num.skill_name) {
        skillArray.push(skill_num);
      }
      //  else {
      //   console.log('invalid credi');
      // }
    }
    console.log(skillArray);
    let projectArray=[]
    for (let index = 1; index <= 6; index++) {
      var proj_num = projects[`proj_${index}`];
      if (proj_num.project_name) {
        projectArray.push(proj_num);
      }
      //  else {
      //   console.log('invalid credi');
      // }
    }
    
    console.log(projectArray);
    
    let expArray=[]
    for (let index = 1; index <= 6; index++) {
      var exp_num = experience[`exp_${index}`];
      if (exp_num.exp_name) {
        expArray.push(exp_num);
       }
       // else {
      //   console.log('invalid credi');
      // }
    }
    console.log(expArray);
    //link array
    let linkarray=[];
    for (let index = 0; index < 4; index++) {
      linkarray.push(links[index])
      
    }
    console.log(linkarray);

  // console.log(skill1_name,name);
    await res.render("portfolio-2/p-2index.ejs", {
        title: title,
        name: name,
        skillArray: skillArray,
        projectArray:projectArray,
        experienceArray: expArray,
        links:linkarray});
  }else{
    console.log("data not found");
  }

})

app.get("/p3",requireLogin,(req,res)=>{
  res.render("portfolio-3/p-3index.ejs")
})  

  