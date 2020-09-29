import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from "react-router-dom"
import M from 'materialize-css'

function PostLayout({ itemId, title, body, postedBy, imgUrl, likes, likeHandler, unlikeHandler, commentHandler, comments, favourite }) {

    const { state, dispatch } = useContext(UserContext)

    const addToFavourites = (itemId) => {

        fetch('/addtofavourites', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                postId: itemId
            })
        })
            .then(res => res.json())
            .then(result => {
                M.toast({ html: 'Added to favourites !', classes: "#43a047 green darken-1 rounded custom-toast" })
                dispatch({ type: "UPDATE_FAV", payload: result.favourites })
                localStorage.setItem('user', JSON.stringify(result))
            })
    }

    const removeFromFavourites = (itemId) => {

        fetch('/removefromfavourites', {
            method: 'put',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify({
                postId: itemId
            })
        })
            .then(res => res.json())
            .then(result => {
                M.toast({ html: 'Removed from favourites !', classes: "#43a047 green darken-1 rounded custom-toast" })
                dispatch({ type: "UPDATE_FAV", payload: result.favourites })
                localStorage.setItem('user', JSON.stringify(result))
                if (favourite) window.location.reload()
            })
    }

    return (
        <div>
            <div className="row valign-wrapper">
                <div className="col s12 m8" style={{ margin: "3% auto" }}>
                    <div className="card hoverable" style={{ padding: "1.5%" }}>
                        <div className="card-image">
                            <img src={imgUrl} alt="pic" />
                        </div>
                        <div className="card-content">
                            <span className="card-title"><b>{title}</b></span>
                            <p>{body}</p>
                            <p className="right-align" ><Link to={postedBy._id === state._id ? `/profile` : `/profile/${postedBy._id}`}><img src={postedBy.pic} alt="pic" style={{ width: '6%', height: '2.4rem', borderRadius: "50%", border: "2px solid" }} />
                            ~{postedBy.name}</Link></p><br />
                            <h6>{likes.length} likes</h6>

                            {state.favourites.includes(itemId) ?
                                <i className="material-icons" style={{ marginRight: "0 1.5%", cursor: 'pointer', color: 'red' }} onClick={() => removeFromFavourites(itemId)}>favorite</i>
                                :
                                <i className="material-icons" style={{ marginRight: "0 1.5%", cursor: 'pointer' }} onClick={() => addToFavourites(itemId)}>favorite</i>
                            }
                            {likes.includes(state._id) ?
                                <i className="material-icons" style={{ margin: "0 1.5%", cursor: "pointer" }} onClick={() => unlikeHandler(itemId)}>thumb_down</i>
                                :
                                <i className="material-icons" style={{ margin: "0 1.5%", cursor: "pointer" }} onClick={() => likeHandler(itemId)}>thumb_up</i>
                            }
                            <div className="comments" style={{ overflowY: 'auto', maxHeight: '20vh' }}>
                                {
                                    comments.map(c => {
                                        return (
                                            <h6 key={c._id}><span style={{ fontWeight: '100', marginRight: '2%' }}><Link to={c.postedBy._id === state._id ? `/profile` : `/profile/${c.postedBy._id}`}><img src={c.postedBy.pic} alt="pic" style={{ width: '6%', height: '2.4rem', borderRadius: "50%", border: "2px solid" }} /> ~ {c.postedBy.name}</Link></span>{c.text}</h6>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="card-action">
                            <form onSubmit={e => {
                                e.preventDefault()
                                commentHandler(e.target[0].value, itemId)
                            }}>
                                <input type="text" placeholder="comment" className="validate" required />
                                <button className="btn waves-effect waves-light #311b92 deep-purple darken-4" type="submit" name="action" style={{ marginTop: "0.4%" }}>Post
                                <i className="material-icons right">send</i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostLayout
