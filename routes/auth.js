const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { SENDGRID_API, EMAIL } = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

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
                        transporter.sendMail({
                            to: user.email,
                            from: 'parnabbbghoshhh1234@gmail.com',
                            subject: 'Signed-up success!',
                            html: '<h1>Welcome to My InstaClone. Have fun! <h1>'
                        })
                            .then(res => {
                                console.log(res)
                            })
                            .catch(e => console.log(e))
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
                const { _id, name, email, followers, following, pic, pic_id, favourites } = savedUser
                return res.json({ token, user: { _id, name, email, followers, following, pic, pic_id, favourites } })
            }
            return res.status(422).json({ error: "Wrong username or password" })
        })

    }).catch(e => {
        console.log(e)
    })

})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (e, buffer) => {
        if (e) console.log(e)
        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) return res.status(422).json({ error: "User does not exist with that email" })
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then(result => {
                    transporter.sendMail({
                        to: user.email,
                        from: 'parnabbbghoshhh1234@gmail.com',
                        subject: 'Password Reset@instaclonepg1004',
                        html: `
                        <h2>You requested for password reset</h2>
                        <p>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password<p>
                    `
                    })
                    res.json({ message: 'Message has been sent to your email!' })
                })
            })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) return res.status(422).json({ error: 'Session has expired ! Try Again !' })

            bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save().then(savedUser => {
                    res.json({ message: "Password updated succesfully !" })
                }).catch(e => console.log(e))
            }).catch(e => console.log(e))

        })

})

module.exports = router