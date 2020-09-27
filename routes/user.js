const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'instaimagesparnab',
    api_key: '633854716324753',
    api_secret: 'OAlI6RKFmiauVj32b91tu3wUkpw',
    upload_preset: 'insta-clone'
})

router.get('/user/:Id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.Id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: user._id })
                .populate("postedBy", "_id name")
                .exec((e, posts) => {
                    if (e) return res.status(404).json({ error: e })
                    res.json({ user, posts })
                })
        })
        .catch(e => res.status(404).json({ error: "User not found" }))
})

router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, { new: true, useFindAndModify: false },
        (e, result) => {
            if (e) return res.status(422).json({ error: e })

            User.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, { new: true, useFindAndModify: false })
                .select("-password")
                .then(result => {
                    res.json(result)
                })
                .catch(e => res.status(422).json({ error: e }))
        }
    )
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unFollowId, {
        $pull: { followers: req.user._id }
    }, { new: true, useFindAndModify: false },
        (e, result) => {
            if (e) return res.status(422).json({ error: e })

            User.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.unFollowId }
            }, { new: true, useFindAndModify: false })
                .select("-password")
                .then(result => {
                    res.json(result)
                })
                .catch(e => res.status(422).json({ error: e }))
        }
    )
})

router.put('/updatepic', requireLogin, (req, res) => {

    if (req.body.curr_pic_id !== "default") {
        cloudinary.uploader.destroy(req.body.curr_pic_id, (e, result) => {
            console.log(e, result)
        })
    }

    User.findByIdAndUpdate(req.user._id, {

        $set: { pic: req.body.pic, pic_id: req.body.pic_id }
    }, { new: true, useFindAndModify: false },

        (e, result) => {
            if (e) return res.status(422).json({ error: 'Pic cannot be updated !' })
            res.json({ message: 'Profile pic updated successfully !' })
        }
    )
})

module.exports = router