import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { UserContext } from '../../App'

function UserProfile(props) {

    const [userPosts, setuserPosts] = useState([])
    const [postDetails, setPostDetails] = useState({})
    const [user, setUser] = useState({})
    const [modelIsOpen, setModelIsOpen] = useState(false)
    const [preloader, setPreloader] = useState(true)
    const [following, setFollowing] = useState(false)
    const [showBtn, setShowBtn] = useState(true)
    const { userId } = useParams()
    const { dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch(`/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(res => res.json())
            .then(result => {
                setUser(result.user)
                setuserPosts(result.posts)
                setPreloader(false)
                if (result.user.followers.includes(JSON.parse(localStorage.getItem('user'))._id)) setFollowing(p => !p)
            })
            .catch(e => console.log(e))

    }, [])

    function clickHandler(imgUrl) {
        fetch(`/fetchthepost`, {

            method: 'post',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imgUrl: imgUrl
            })

        })
            .then(res => res.json())
            .then(post => {
                console.log(post)
                setPostDetails(post.post)
                setModelIsOpen(true)
                setShowBtn(false)
            })
            .catch(e => console.log(e))
    }

    const followUser = () => {
        fetch(`/follow`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                followId: userId
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                setFollowing(p => !p)
                localStorage.setItem('user', JSON.stringify(data))
                setUser(prevUser => {
                    return {
                        ...prevUser,
                        followers: [...prevUser.followers, data._id]
                    }
                })
            })
    }

    const unFollowUser = () => {
        fetch(`/unfollow`, {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                unFollowId: userId
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem('user', JSON.stringify(data))
                setFollowing(p => !p)
                setUser(prevUser => {
                    const newFollowers = prevUser.followers.filter(item => item !== data._id)
                    return {
                        ...prevUser,
                        followers: newFollowers
                    }
                })
            })
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "30px 0px ", padding: "30px 0px", borderBottom: "2px solid black" }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={"https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"} alt={props.text} />
                </div>
                <div>
                    <h4>{user ? user.name : "Loading ...!"}</h4>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {userPosts.length ? userPosts.length === 1 ? <h5>1 post</h5> : <h5>{userPosts.length} posts</h5> : <h5>Loading...!</h5>}
                        {user.followers ? <h5>{user.followers.length} followers</h5> : ""}
                        {user.following ? <h5>{user.following.length} following</h5> : ""}
                    </div><br />
                    {userPosts.length && showBtn ? !following ?
                        <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={() => followUser()}>Follow</button>
                        :
                        <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={() => unFollowUser()}>Unfollow</button>
                        : ""
                    }
                </div>
            </div>
            <h3>Posts</h3><br />
            <Modal isOpen={modelIsOpen} ariaHideApp={false} style={{ overlay: { width: "72%", margin: "0px auto" } }}>
                <div className="row valign-wrapper">
                    <div className="col s12 m8" style={{ margin: "3% auto" }}>
                        <div className="card hoverable" style={{ padding: "1.5%" }}>
                            <div className="card-image">
                                <img alt={postDetails._id} src={postDetails.pic} />
                            </div>
                            <div className="card-content">
                                <span className="card-title"><b>{postDetails.title}</b></span>
                                <p>{postDetails.body}</p>
                                <p className="right-align"> ~ {postDetails.postedBy ? postDetails.postedBy.name : ""}</p><br />
                                <h6>{postDetails.likes ? postDetails.likes.length : ""} likes</h6>
                                {postDetails.comments ?
                                    postDetails.comments.map(c => {
                                        return (
                                            <h6 key={c._id}><span style={{ fontWeight: '100', marginRight: '2%' }}>~ {c.postedBy.name}</span>{c.text}</h6>
                                        )
                                    })
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button key={3} className="btn waves-effect waves-light #311b92 deep-purple darken-4" style={{ display: "block", margin: "0px auto" }} name="action" onClick={() => {
                    setModelIsOpen(false)
                    setShowBtn(true)
                }}>Close</button>
            </Modal>
            <div className='gallery'>
                {
                    !preloader ?
                        userPosts.length ?
                            userPosts.map(post => {
                                return <img key={post._id} className="item hoverable" src={post.pic} alt={post.title} onClick={e => clickHandler(e.target.src)} />
                            }) : <p style={{ display: "block", marginTop: "-80%", marginLeft: "10%" }}>No posts available !</p>
                        : <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default UserProfile
