import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'

function Navbar() {

    const { state, dispatch } = useContext(UserContext)

    const logout = () => {
        localStorage.clear()
        dispatch({ type: 'CLEAR' })
    }

    const renderList = () => {
        if (state) {
            return [
                <li key={1}><Link to="/allposts">All posts</Link></li>,
                <li key={2}><Link to="/profile">My Profile</Link></li>,
                <li key={3}><Link to="/createPost">Create Post</Link></li>,
                <li key={4}><Link to="/signin" onClick={logout}>Logout</Link></li>
            ]
        }

        else {
            return [
                <li key={1}><Link to="/signin">Signin</Link></li>,
                <li key={2}><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={state ? "/" : "/signin"} className="brand-logo m6">Instagram</Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
