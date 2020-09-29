import React, { useState, useEffect } from 'react'
import PostLayout from './PostLayout'

function AllPosts() {

    const [data, setData] = useState([])
    const [preload, setPreload] = useState(true)

    useEffect(() => {

        fetch(`/favouriteposts`, {
            method: 'post',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },

        }).then(res => res.json())
            .then(result => {
                setData(result.posts)
                setPreload(false)
            })
    }, [])

    const likePost = (id) => {
        fetch(`/like`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                postId: id
            })

        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id === item._id) return result
                    return item
                })
                setData(newData)
            })
    }

    const unlikePost = (id) => {
        fetch(`/unlike`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id === item._id) return result
                    return item
                })
                setData(newData)
            })
            .catch(e => console.log(e))
    }

    const makeComment = (text, postId) => {
        fetch(`/comment`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({
                text: text,
                postId: postId
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id === item._id) return result
                    return item
                })
                setData(newData)
            })
            .catch(e => { console.log(e) })
    }

    return (
        <div>
            { !preload ?
                data.length ?
                    data.map(item => {
                        return (
                            <PostLayout key={item._id} itemId={item._id} title={item.title} body={item.body} postedBy={item.postedBy} imgUrl={item.pic} likes={item.likes} likeHandler={likePost} unlikeHandler={unlikePost}
                                commentHandler={makeComment} comments={item.comments} favourite={true} />
                        )
                    })
                    : <h2 className="center-align">No favourite posts ..!</h2>
                : <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            }

        </div>
    )
}

export default AllPosts
