const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const cloudinary = require('cloudinary').v2
const { CLOUDINARY } = require('../config/keys')

cloudinary.config({
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
    upload_preset: CLOUDINARY.UPLOAD_PRESET
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

router.post('/followers/:Id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.Id })
        .select('followers')
        .populate('followers', '_id name pic')
        .then(user => {
            res.json(user)
        })
        .catch(e => console.log(e))
})

router.post('/following/:Id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.Id })
        .select('following')
        .populate('following', '_id name pic')
        .then(user => {
            res.json(user)
        })
        .catch(e => console.log(e))
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

router.put('/addtofavourites', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $push: { favourites: req.body.postId },
    }, { new: true, useFindAndModify: false },
        (e, result) => {
            if (e) return res.status(422).json({ error: e })
            res.json(result)
        }
    )
})

router.put('/removefromfavourites', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $pull: { favourites: req.body.postId },
    }, { new: true, useFindAndModify: false },
        (e, result) => {
            if (e) return res.status(422).json({ error: e })
            res.json(result)
        }
    )
        .populate("favourites.postedBy", "_id name pic")
        .populate("", "_id name pic")
})

router.post('/favouriteposts', requireLogin, (req, res) => {
    Post.find({ _id: req.user.favourites })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        }).catch(e => {
            console.log(e)
        })
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

router.post('/search-users', (req, res) => {
    let searchPattern = new RegExp(`^${req.body.query}`, 'i')
    User.find({ name: { $regex: searchPattern } })
        .select('_id name pic')
        .then(users => {
            res.json({ users })
        })
        .catch(e => console.log(e))
})



module.exports = router