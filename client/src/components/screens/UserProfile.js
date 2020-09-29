import React, { useEffect, useState, useContext, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

function UserProfile(props) {

    const [userPosts, setuserPosts] = useState([])
    const [postDetails, setPostDetails] = useState({})
    const [user, setUser] = useState({})
    const [preloader, setPreloader] = useState(true)
    const [following, setFollowing] = useState(false)
    const { userId } = useParams()
    const { dispatch } = useContext(UserContext)
    const modal1 = useRef(null)
    const modal2 = useRef(null)

    useEffect(() => {
        M.Modal.init(modal1.current)
        M.Modal.init(modal2.current)
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
                setPostDetails(post.post)
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
                    {
                        user.pic && userPosts ?
                            <img className="hoverable modal-trigger" data-target="modal4" style={{ width: "200px", height: "200px", borderRadius: "100px", marginTop: "10%", cursor: "pointer", border: "4px solid" }} src={user.pic} alt="pic" /> : ""
                    }
                </div>
                <div>
                    {user.pic && userPosts ?
                        <>
                            <h4>{user.name}</h4>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {userPosts.length === 1 ? <h5>{userPosts.length} post </h5> : <h5>{userPosts.length} posts</h5>}
                                <h5><Link to={`/profile/${userId}/followers`}>{user.followers ? user.followers.length : ""} followers</Link></h5>
                                {<h5><Link to={`/profile/${userId}/following`}>{user.following ? user.following.length : ""} following</Link></h5>}
                            </div><br />
                            {!following ?
                                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={() => followUser()}>Follow</button>
                                :
                                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={() => unFollowUser()}>Unfollow</button>
                            }
                        </>
                        : <h5>Loading...!</h5>}
                </div>
            </div>
            {user.pic ? <h3>Posts</h3> : ""}<br />
            <div id="modal4" className="modal modal-fixed-footer" ref={modal1}>
                <div className="row valign-wrapper" style={{ width: "76%", height: "82%" }}>
                    <div className="col s12 m8" style={{ margin: "3% auto" }}>
                        <div className="card" style={{ padding: "1.5%" }}>
                            <div className="card-image">
                                <img src={user ? user.pic : ""} alt="pic" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>

            <div id="modal5" className="modal modal-fixed-footer" ref={modal2} style={{ width: "62%" }}>
                <div className="modal-content">
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
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
                </div>
            </div>
            <div className='gallery'>
                {
                    !preloader ?
                        userPosts.length ?
                            userPosts.map(post => {
                                return <img key={post._id} className="item hoverable modal-trigger" data-target="modal5" src={post.pic} alt={post.title} onClick={e => clickHandler(e.target.src)} />
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
