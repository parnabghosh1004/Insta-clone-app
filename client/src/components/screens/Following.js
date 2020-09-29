import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { UserContext } from '../../App'

function Following() {

    const { userId } = useParams()
    const { state } = useContext(UserContext)
    const [following, setFollowing] = useState([])
    const [preload, setPreload] = useState(true)

    useEffect(() => {
        fetch(`/following/${userId}`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
        })
            .then(res => res.json())
            .then(following => {
                setFollowing(following.following)
                setPreload(false)
            })
    }, [])

    return (
        <div>
            {!preload ? following.length ?
                following.map(user => {
                    return <ul className="collection">
                        <li key={user._id} className="collection-item">
                            <img src={user.pic} style={{ width: "6.4rem", height: "6.4rem", borderRadius: "50%" }} /> <p style={{ position: 'absolute', top: '20%', left: '16%', fontFamily: 'cursive', fontSize: "150%" }}><Link to={user._id === state._id ? `/profile` : `/profile/${user._id}`}>{user.name}</Link></p>
                        </li>
                    </ul>
                })
                : <h2 className="center-align">No followers till now ...!</h2>
                : <div className="progress">
                    <div className="indeterminate"></div>
                </div>
            }
        </div>
    )
}

export default Following
