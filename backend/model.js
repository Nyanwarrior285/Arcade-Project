const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    game: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: "",
    },
    score: {
        type: Number,
        required: true,
    },
});

const Score = mongoose.model("Score", scoreSchema);

mongoose.connect(
    "mongodb+srv://Bradley:ILikeMe1!@cluster0.pqxkiyk.mongodb.net/Arcade?retryWrites=true&w=majority&appName=Cluster0"
);

module.exports = Score;