import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import M from "materialize-css"

function NewPassword() {

    const history = useHistory()
    const [password, setPassword] = useState("")
    const { token } = useParams()

    const postData = () => {

        fetch(`/new-password`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3 rounded custom-toast" })
                    history.push('/reset')
                }
                else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1 rounded custom-toast" })
                    history.push('/signin')
                }
            }).catch(e => {
                console.log(e)
            })
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="password" placeholder="Enter a new password" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={postData}>Update Password</button>
            </div>
        </div>
    )
}

export default NewPassword
