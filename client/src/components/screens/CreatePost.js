import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import M from "materialize-css"

function CreatePost() {

    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [imgId, setImgId] = useState("")

    useEffect(() => {
        // for mongodb to store the posts

        if (url && imgId) {
            fetch(`/createpost`, {
                method: "post",
                headers: {
                    "content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url,
                    pic_id: imgId
                })
            }).then(res => res.json())
                .then(data => {
                    if (data.error) M.toast({ html: data.error, classes: "#c62828 red darken-3 rounded custom-toast" })
                    else {
                        M.toast({ html: "Post has been created successfully!", classes: "#43a047 green darken-1 rounded custom-toast" })
                        history.push('/')
                    }
                }).catch(e => {
                    console.log(e)
                })
        }
    }, [url, imgId])

    const postDetails = () => {

        // uploading to cloudinary
        if (title && body && image) {
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
                })
                .catch(e => console.log(e))
        }
        else {
            M.toast({ html: "Please specify all the fields !", classes: "#c62828 red darken-3 rounded custom-toast" })
        }

    }


    return (
        <div>
            <div className="mycard">
                <div className="card auth-card input-field post-card">
                    <input type="text" placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
                    <input type="text" placeholder="body" value={body} onChange={e => setBody(e.target.value)} />
                    <div className="file-field input-field">
                        <div className="btn #311b92 deep-purple darken-4">
                            <span>File</span>
                            <input type="file" onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload an image" />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={() => postDetails()}>Post</button>
                </div>
            </div>
        </div>
    )
}

export default CreatePost
