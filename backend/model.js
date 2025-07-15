require('dotenv').config();

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


// remember to : npm install dotenv in backend directory
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = Score;