require('dotenv').config();

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


// remember to : npm install dotenv in backend directory
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Score = mongoose.model("Score", scoreSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    Score: Score,
    User: User
};