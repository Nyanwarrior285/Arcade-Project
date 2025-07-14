const express = require("express");
const Score = require("./model.js");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Users");
require('dotenv').config();

const PORT = 3000;

function main() {
    const app = express();
    app.use(cors({
        credentials: true
    }));

    app.use(express.json());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
  }
}));


    app.get("/scores", async (req,res) => {
        const result = await Score.find({});
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
            res.status(500).send({error: "Failed to create object"})
        }
    });

    app.listen(PORT, () => {
        console.log("Server listening at http://localhost:" + PORT + "/");
    });
};

main();