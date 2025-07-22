require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const cors = require("cors");
// models: 
const Score = require("./model.js");
const User = require("./Users.js");                // model import, the main-express is the main backend entry point.  connect the models and front end damn.

const PORT = process.env.PORT || 3000;    // ok, default to 3000 if no env PORT is set

function main() {
    const app = express();
    app.use(
        cors({
            credentials: true,
            origin: function (origin, callback) {
                callback(null, origin);
            },
        }),
    );

    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            maxAge: 1000 * 60 * 60 * 24, // 是1天噢 ！
        }
}));


// ====================================================== User =================================================================


app.use(express.static("./dist"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected 成功"))            // it is nice to have this notice dude. 
.catch(err => console.error("失败 MongoDB connection error:", err.message));

// User model (inline, no separate file)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);   // 10 rounds
    next();
});


// POST /Register: ==================================================================================================================================================================
app.post( "/register", async(req, res) => {     // yea, this is literally defins the register router.    this sends POST request to /register touter, then backend will use this async function to oprate...receive user data from front ---> check user existence ---> hash ----> save to database ---> 根据设定的条件来 creates a session 
    console.log("req.body = ", req.body );      // 这一行把客户端通过请求体（body）发送过来的数据输出到终端控制台，用于调试。
    const { name, email, password } = req.body;       // 如果用户通过注册表单发送了邮箱和密码，这里会显示： req.body = { email: "user@example.com", password: "userpassword" }

    if ( !email || !password ) {
        res.status ( 400 ).json({ message: "Email and password required" });
        return;                                             // dont forget to return
    }

  // Only reach here if the user doesn't exist 
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
});



// POST /Login =============================================================================================================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
    
    req.session.session_email = user.email;                      // 当用户登录成功后，把这个用户的邮箱保存到 session 中，作为登录状态的标记。
    
    res.status(200).json({ 
        message: "Login successful" ,
        name: user.name,
        email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// get Logout   =============================================================================================================
app.get("/logout", ( req, res ) => {
  if (req.session.session_email) {
    req.session.destroy ((err) => {
      if (err) {
        res.status(500).json({message: "Failed to log out. Oops!"});
        return;
      }
      res.clearCookie("connect.sid");

      res.status( 200 ).json({message: "logged out sucessfully~ whatever."})
    });
  } else {
      res.status(400).json({ message: "You are not logged in." });
  }
});



// ======================================================== Score ===============================================================
    app.get("/scores", async (req,res) => {
        const result = await Score.find({});
        res.json(result);
    });

    app.get("/scores/game/:gameName", async (req,res) => {
        const result = await Score.find({game: req.params.gameName}).sort({score: -1})
        res.json(result);
    });

    app.get("/scores/:id", async (req,res) => {
        const object_id = new mongoose.Types.ObjectId(req.params.id);
        const result = await Score.findById(object_id)
        if (result) {
            res.json(result);
        } else {
            res.status(404).send({error: "Unable to find entry with that ID"});
        }
    });

    app.post("/scores", express.json(), async (req, res) => {
        const result = await Score.create(req.body);
        if (result) {
            res.json(result);
        } else {
            res.status(500).send({error: "Failed to create object"});
        }
    });



    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    });

    // app.listen(PORT, "0.0.0.0", () => {
    //     console.log(`Server listening at http://0.0.0.0:"${PORT}`);
    // });
};





main();