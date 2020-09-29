import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

function Navbar() {

    const { state, dispatch } = useContext(UserContext)
    const searchModal = useRef(null)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const logout = () => {
        localStorage.clear()
        dispatch({ type: 'CLEAR' })
    }

    const renderList = () => {
        if (state) {
            return [
                <li key={0}><i className="material-icons modal-trigger" data-target="modal1" style={{ color: 'black', cursor: 'pointer', position: 'relative', right: '70%' }} >search</i></li>,
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

    const fetchUsers = (query) => {
        setSearch(query)
        fetch(`/search-users`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        })
            .then(res => res.json())
            .then(result => {
                setUsers(result.users)
            })
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
                <div id="modal1" className="modal" ref={searchModal} style={{ color: "black", padding: "14px 14px" }}>
                    <input type="text" placeholder="find users..." value={search} onChange={e => fetchUsers(e.target.value)} />
                    {
                        search ?
                            <ul className="collection">
                                {users.map(user => {
                                    return <li key={user._id} className="collection-item">
                                        <img src={user.pic} alt="pic" style={{ width: '6%', height: '2.1rem', borderRadius: "50%", border: "2px solid" }} />
                                        <Link to={user._id === state._id ? `/profile` : `/profile/${user._id}`} onClick={() => {
                                            M.Modal.getInstance(searchModal.current).close()
                                            setSearch('')
                                            setUsers([])
                                        }} style={{ display: "inline", fontSize: '1.2rem' }}>{user.name}</Link></li>

                                })}
                            </ul>
                            : ""}
                    <div className="modal-footer">
                        <button href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                            setSearch('')
                            setUsers([])
                        }}>Close</button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
