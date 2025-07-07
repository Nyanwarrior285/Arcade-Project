const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: false,
    },
    streams: {
        type: Number,
        default: 0,
    },
});

const Song = mongoose.model("Song", songSchema);

mongoose.connect(
    "mongodb+srv://Bradley:ILikeMe1!@cluster0.pqxkiyk.mongodb.net/songs-list?retryWrites=true&w=majority&appName=Cluster0"
);

module.exports = Song;