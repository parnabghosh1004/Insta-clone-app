import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import Modal from 'react-modal'
import M from 'materialize-css'

function MyProfile(props) {

    const [myPosts, setMyPosts] = useState(null)
    const [postDetails, setPostDetails] = useState({})
    const [model1, setModel1] = useState(false)
    const [model2, setModel2] = useState(false)
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [imgId, setImgId] = useState("")
    const [preloader, setPreloader] = useState(true)
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch(`/myposts`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            }
        })
            .then(res => res.json())
            .then(result => {
                setMyPosts(result.myposts)
                setPreloader(false)
            })
            .catch(e => console.log(e))

    }, [])

    useEffect(() => {

        if (imgId && url) {
            fetch(`/updatepic`, {
                method: 'put',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pic: url,
                    pic_id: imgId,
                    curr_pic_id: state.pic_id
                })
            })
                .then(res => res.json())
                .then(result => {
                    M.toast({ html: result.message, classes: "#43a047 green darken-1 rounded custom-toast" })
                    document.getElementById('uploadImage').value = ""
                    // setMode
                    // window.location.reload()
                })
        }
    }, [imgId, url])

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
                setModel2(true)
            })
            .catch(e => console.log(e))
    }

    function handleDeletePost() {
        fetch(`deletepost/${postDetails._id}`, {
            method: 'delete',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pic_id: postDetails.pic_id
            })
        })
            .then(res => res.json())
            .then(data => {
                M.toast({ html: data.message, classes: "#43a047 green darken-1 rounded custom-toast" })
                window.location.reload()
            })
    }

    function updateProfilePic() {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone")
            data.append("cloud_name", "instaimagesparnab")

            fetch(`	https://api.cloudinary.com/v1_1/instaimagesparnab/image/upload`, {
                method: "post",
                body: data,
            })
                .then(res => res.json())
                .then(data => {
                    setImgId(data.public_id)
                    setUrl(data.secure_url)

                    localStorage.setItem('user', JSON.stringify({ ...state, pic: data.secure_url, pic_id: data.public_id }))
                    dispatch({ type: "UPDATEPIC", payload: { pic: data.secure_url, pic_id: data.secure_url } })
                })
                .catch(e => console.log(e))
        }
        else {
            M.toast({ html: "Please select an image first !", classes: "#c62828 red darken-3 rounded custom-toast" })
        }
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "30px 0px ", padding: "30px 0px", borderBottom: "2px solid black" }}>
                <div>
                    {
                        state && myPosts ?
                            <img className="hoverable" style={{ width: "200px", height: "200px", borderRadius: "100px", marginTop: "10%", cursor: "pointer" }} src={state.pic} alt="pic" onClick={() => setModel1(true)} /> : ""
                    }
                </div>
                <div>
                    {state && myPosts ?
                        <>
                            <h4>{state.name}</h4>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {myPosts.length === 1 ? <h5>{myPosts.length} post </h5> : <h5>{myPosts.length} posts</h5>}
                                {<h5>{state.followers.length} followers</h5>}
                                {<h5>{state.following.length} following</h5>}
                            </div>
                        </>
                        : <h5>Loading...!</h5>}
                </div>
            </div>
            <h3>My Posts</h3><br />

            <Modal isOpen={model1} ariaHideApp={false} style={{ overlay: { width: "76 %", margin: "auto", height: "75%" } }}>
                <div className="row valign-wrapper" style={{ width: "50%", height: "60%" }}>
                    <div className="col s12 m8" style={{ margin: "3% auto" }}>
                        <div className="card" style={{ padding: "1.5%" }}>
                            <div className="card-image">
                                <img src={state ? state.pic : ""} alt="pic" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field">
                    <div className="btn #311b92 deep-purple darken-4">
                        <span>Upload pic</span>
                        <input type="file" onChange={e => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input id="uploadImage" className="file-path validate" type="text" placeholder="" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" style={{ display: "block", margin: "4px auto" }} name="action" onClick={() => updateProfilePic()}>Update Profile pic</button>
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" style={{ display: "block", margin: "4px auto" }} name="action" onClick={() => setModel1(false)}>Close</button>
            </Modal>

            <Modal isOpen={model2} ariaHideApp={false}>
                <i className="material-icons hovorable" style={{ float: "right", cursor: "pointer" }} onClick={handleDeletePost}>delete</i>
                <div className="row valign-wrapper" >
                    <div className="col s12 m8" style={{ margin: "3% auto" }}>
                        <div className="card " style={{ padding: "1.5%" }}>
                            <div className="card-image">
                                <img src={postDetails.pic} alt="pic" />
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
                <button key={3} className="btn waves-effect waves-light #311b92 deep-purple darken-4" style={{ display: "block", margin: "0px auto" }} name="action" onClick={() => setModel2(false)}>Close</button>
            </Modal>
            <div className='gallery'>
                {
                    !preloader ?
                        myPosts.length ?
                            myPosts.map(post => {
                                return <img key={post._id} className="item hoverable" src={post.pic} alt={post.title} onClick={e => clickHandler(e.target.src)} />
                            }) : <p style={{ display: "block", width: "max-content", marginTop: "-80%", marginLeft: "30%" }}>You don't have any posts right now !</p>
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

export default MyProfile
