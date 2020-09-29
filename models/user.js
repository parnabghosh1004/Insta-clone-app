const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireToken: Date,
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/instaimagesparnab/image/upload/v1601044739/146-1461473_default-profile-picture-transparent_rx1wow.png'
    },
    pic_id: {
        type: String,
        default: 'default'
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    favourites: [{ type: ObjectId, ref: "Post" }]
})

mongoose.model("User", userSchema)
