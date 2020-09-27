export const initialState = null

export const reducer = (state, action) => {
    if (action.type === "USER") return action.payload
    if (action.type === "UPDATE") return { ...state, followers: action.payload.followers, following: action.payload.following }
    if (action.type === "UPDATEPIC") return { ...state, pic: action.payload.pic, pic_id: action.payload.pic_id }
    if (action.type === "CLEAR") return null
    return state
}