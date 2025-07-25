require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require("express");
const session = require('express-session');
const mongoose = require("mongoose");
const cors = require("cors");

// models: 
const { Score, User } = require("./model.js");

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


// POST /Register: ==================================================================================================================================================================
app.post( "/register", async(req, res) => {     // yea, this is literally defins the register router.    this sends POST request to /register touter, then backend will use this async function to oprate...receive user data from front ---> check user existence ---> hash ----> save to database ---> 根据设定的条件来 creates a session 
    console.log("req.body = ", req.body );      // 这一行把客户端通过请求体（body）发送过来的数据输出到终端控制台，用于调试。
    const { email, password, username } = req.body;       // 如果用户通过注册表单发送了邮箱和密码，这里会显示： req.body = { email: "user@example.com", password: "userpassword" }

    if ( !email || !password ) {
        res.status ( 400 ).json({ message: "Email and password required" });
        return;                                             // dont forget to return
    }

  // Only reach here if the user doesn't exist 
    const newUser = new User({ email, password, username });
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
        username: user.username,
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
        const result = await Score.find({}).limit(10);
        res.json(result);
    });

    app.get("/scores/user/:email", async (req,res) => {
        const result = await Score.find({email: req.params.email});
        res.json(result);
    })

    app.get("/scores/game/:gameName", async (req,res) => {
        const result = await Score.find({game: req.params.gameName}).sort({score: -1});
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

    // app.patch("/scores", async (req,res) => {
    //     const result = await Score.find({email: undefined});
    //     for (let i = 0; i < result.length; i++) {
    //         const user = await User.find({username: result[i].name});
    //         if (user[0]) {
    //             result[i].email = user[0].email;
    //         }
    //     }
    //     result.splice(2,1);
    //     await result.save();
    //     res.json(result);
    // })

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    });

};





main();