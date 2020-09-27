const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'instaimagesparnab',
    api_key: '633854716324753',
    api_secret: 'OAlI6RKFmiauVj32b91tu3wUkpw',
    upload_preset: 'insta-clone'
})

router.post('/createpost', requireLogin, (req, res) => {

    const { title, body, pic, pic_id } = req.body

    if (!title || !body || !pic) return res.status(422).json({ error: "Please add all the fields !" })

    req.user.password = undefined

    const post = new Post({
        title,
        body,
        pic,
        pic_id,
        postedBy: req.user
    })
    post.save().then(result => {
        res.send({ post: result })
    }).catch(e => console.log(e))

})

router.get('/allposts', requireLogin, (req, res) => {
    Post.find().populate("postedBy", "_id name").populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        }).catch(e => {
            console.log(e)
        })
})

router.get('/myFollowingPosts', requireLogin, (req, res) => {
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name").populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({ posts })
        }).catch(e => {
            console.log(e)
        })
})

router.get('/myposts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id }).populate("postedBy", "_id name")
        .then(myposts => {
            res.json({ myposts })
        }).catch(e => {
            console.log(e)
        })
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, { new: true, useFindAndModify: false }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((e, result) => {
            if (e) return res.status(422).json({ error: e })
            res.json(result)
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, { new: true, useFindAndModify: false }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((e, result) => {
            if (e) return res.status(422).json({ error: e })
            return res.json(result)
        })
})

router.put('/comment', requireLogin, (req, res) => {

    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, { new: true, useFindAndModify: false }
    )
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((e, result) => {
            if (e) return res.status(422).json({ error: e })
            return res.json(result)
        })
})

router.post('/fetchthepost', requireLogin, (req, res) => {

    Post.findOne({ pic: req.body.imgUrl })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then(post => {
            res.json({ post })
        })
        .catch(e => console.log(e))
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", '_id ')
        .exec((e, post) => {
            if (e) return res.status(422).json({ error: e })
            post.remove()
                .then(result => {
                    res.json({ message: " Deleted successfully !" })
                    cloudinary.uploader.destroy(req.body.pic_id, (e, result) => {
                        console.log(e, result)
                    })
                })
                .catch(e => console.log(e))
        })

})

module.exports = router