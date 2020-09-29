import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Navbar from './components/Navbar';
import './App.css'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import MyProfile from './components/screens/MyProfile';
import UserProfile from './components/screens/UserProfile'
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import { initialState, reducer } from './reducers/userReducer'
import AllPosts from './components/screens/AllPosts';
// import Footer from './components/Footer';
import ResetPassword from './components/screens/ResetPassword';
import NewPassword from './components/screens/NewPassword';
import Followers from './components/screens/Followers';
import Following from './components/screens/Following';

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else {
      if (!history.location.pathname.startsWith('/reset')) history.push("/signin")
    }
  }, [])

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/allposts">
          <AllPosts />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/profile">
          <MyProfile text="profile" />
        </Route>
        <Route exact path="/profile/:userId">
          <UserProfile />
        </Route>
        <Route exact path="/profile/:userId/followers">
          <Followers />
        </Route>
        <Route exact path="/profile/:userId/following">
          <Following />
        </Route>
        <Route path="/createPost">
          <CreatePost />
        </Route>
        <Route exact path="/reset">
          <ResetPassword />
        </Route>
        <Route path="/reset/:token">
          <NewPassword />
        </Route>
      </Switch>
    </>
  )
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
