const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')

router.post('/signup', (req, res) => {

    const { name, email, password, pic, pic_id } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please include all the fields" })
    }

    User.findOne({ email: email })
        .then((savedUser) => {

            if (savedUser) {
                return res.status(422).json({ error: "user already exists with this email" })
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        password: hashedPassword,
                        email,
                        name,
                        pic,
                        pic_id
                    })

                    user.save().then(user => {
                        res.json({ message: "Saved successfully" })
                    })
                        .catch(e => {
                            console.log(e)
                        })
                })
        })
        .catch(e => {
            console.log(e)
        })

})

router.post('/signin', (req, res) => {

    const { email, password } = req.body

    if (!email || !password) return res.status(422).json({ error: "Please provide username or password" })

    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) return res.status(422).json({ error: "Wrong username or password" })

        bcrypt.compare(password, savedUser.password).then(doMatch => {
            if (doMatch) {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, email, followers, following, pic, pic_id } = savedUser
                return res.json({ token, user: { _id, name, email, followers, following, pic, pic_id } })
            }
            return res.status(422).json({ error: "Wrong username or password" })
        })

    }).catch(e => {
        console.log(e)
    })

})

module.exports = router