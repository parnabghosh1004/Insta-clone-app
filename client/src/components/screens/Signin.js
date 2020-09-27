import React ,{useState , useContext} from 'react'
import {Link , useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from "materialize-css"

function Signin() {

    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password , setPassword] = useState("")    
    const [email , setEmail] = useState("")    

    const postData = () => {

        if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) return  M.toast({html:"Invalid email type!" , classes:"#c62828 red darken-3 rounded"} )
        
        fetch(`/signin`, {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
        .then(data => { 
            if(data.error) M.toast({html: data.error , classes:"#c62828 red darken-3 rounded custom-toast"})
            else{
                localStorage.setItem("jwt" , data.token)
                localStorage.setItem("user" , JSON.stringify(data.user))
                dispatch({type:"USER" , payload:data.user})
                M.toast({html:"LoggedIn successfully" , classes:"#43a047 green darken-1 rounded custom-toast"} )
                history.push('/')
            }
        }).catch(e => {
            console.log(e)
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" onClick={postData}>Login</button>
                <h6>
                    Don't have an account?
                    <Link to="/signup"> signup</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin
