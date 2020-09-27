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
import Footer from './components/Footer';

export const UserContext = createContext()

const Routing = () => {

  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: "USER", payload: user })
    }
    else history.push("/signin")
  }, [])

  return (
    <>
      <Switch>
        <Route exact path="/">
          <Home />
          {/* <Footer /> */}
        </Route>
        <Route path="/allposts">
          <AllPosts />
          {/* <Footer /> */}
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/profile">
          <MyProfile text="profile" />
          {/* <Footer /> */}
        </Route>
        <Route path="/profile/:userId">
          <UserProfile />
          {/* <Footer /> */}
        </Route>
        <Route path="/createPost">
          <CreatePost />
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
