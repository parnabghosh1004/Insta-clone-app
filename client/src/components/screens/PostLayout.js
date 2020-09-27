import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from "react-router-dom"

function PostLayout({ itemId, title, body, postedBy, imgUrl, likes, likeHandler, unlikeHandler, commentHandler, comments }) {

    const { state } = useContext(UserContext)

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
                            <p className="right-align" ><Link to={postedBy._id === state._id ? `/profile` : `/profile/${postedBy._id}`}>~ {postedBy.name}</Link></p><br />
                            <h6>{likes.length} likes</h6>
                            <i className="material-icons" style={{ marginRight: "0 1.5%" }}>favorite</i>
                            {likes.includes(state._id) ?
                                <i className="material-icons" style={{ margin: "0 1.5%", cursor: "pointer" }} onClick={() => unlikeHandler(itemId)}>thumb_down</i>
                                :
                                <i className="material-icons" style={{ margin: "0 1.5%", cursor: "pointer" }} onClick={() => likeHandler(itemId)}>thumb_up</i>
                            }
                            {
                                comments.map(c => {
                                    return (
                                        <h6 key={c._id}><span style={{ fontWeight: '100', marginRight: '2%' }}>~ {c.postedBy.name}</span>{c.text}</h6>
                                    )
                                })
                            }
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
