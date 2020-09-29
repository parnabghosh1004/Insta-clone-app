import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

function Signup() {

    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState(undefined)
    const [imgId, setImgId] = useState("")

    const setDetails = () => {
        fetch(`/signup`, {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url,
                pic_di: imgId
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) M.toast({ html: data.error, classes: "#c62828 red darken-3 rounded custom-toast" })
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1 rounded custom-toast" })
                    history.push('/signin')
                }
            }).catch(e => {
                console.log(e)
            })
    }

    useEffect(() => {
        if (url && imgId) {
            setDetails()
        }
    }, [url, imgId])

    const postData = () => {
        // uploading to cloudinary

        if (name && email && password) {

            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) return M.toast({ html: "Invalid Email", classes: "#c62828 red darken-3 rounded custom-toast" })

            if (image) {
                const data = new FormData()
                data.append("file", image)
                data.append("upload_preset", "insta-clone")
                data.append("cloud_name", "instaimagesparnab")

                fetch(`https://api.cloudinary.com/v1_1/instaimagesparnab/image/upload`, {
                    method: "post",
                    body: data,
                })
                    .then(res => res.json())
                    .then(data => {
                        setUrl(data.secure_url)
                        setImgId(data.public_id)
                    })
                    .catch(e => console.log(e))
            }

            else setDetails()
        }
        else {
            M.toast({ html: "Please specify all the fields !", classes: "#c62828 red darken-3 rounded custom-toast" })
        }

    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn #311b92 deep-purple darken-4">
                        <span>Add Profile pic</span>
                        <input type="file" onChange={e => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="(Optional)" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={postData}>Signup</button><br /><br />
                <h6>
                    Already have an account?
                    <Link to="/login"> Signin</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signup
