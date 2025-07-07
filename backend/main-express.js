const express = require("express");
const Song = require("./model.js");
const mongoose = require("mongoose");

const PORT = 3000;

function main() {
    const app = express();

    app.get("/songs-list", async (req,res) => {
        const result = await Song.find({});
        res.json(result);
    });

    app.get("/songs-list/:id", async (req,res) => {
        const object_id = new mongoose.Types.ObjectId(req.params.id);
        const result = await Song.findById(object_id)
        if (result) {
            res.json(result);
        } else {
            res.status(404).send({error: "Unable to find entry with that ID"});
        }
    });

    app.post("/songs-list", express.json(), async (req, res) => {
        const result = await Song.create(req.body);
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