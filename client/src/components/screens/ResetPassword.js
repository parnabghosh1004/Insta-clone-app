import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import M from "materialize-css"

function ResetPassword() {

    const history = useHistory()
    const [email, setEmail] = useState("")

    const postData = () => {

        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) return M.toast({ html: "Invalid Email !", classes: "#c62828 red darken-3 rounded custom-toast" })

        fetch(`/reset-password`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
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

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="email" placeholder="Enter your registered email" value={email} onChange={e => setEmail(e.target.value)} /><br /><br />
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={postData}>Reset Password</button>
            </div>
        </div>
    )
}

export default ResetPassword

