import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Registration from './components/registration/Registration.js'
import ProfileCreate from './components/profile-create/ProfileCreate.js'
import ProfileEdit from './components/profile-edit/ProfileEdit.js'
import ProfileList from './components/profile-list/ProfileList.js'
import Profile from './components/profile/Profile.js'
import Header from './components/header/Header.js'
import Login from './components/login/Login.js'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(()=>{
    axios.get('/checkAuth', {withCredentials: true})
    .then(resp =>{
      // console.log(resp)
      if(resp.data.id){
        setIsLoggedIn(true)
        setUserId(resp.data.id)
      }
    })
  }, [])

  const handleLoginState = (value)=>{
    setIsLoggedIn(value)
  }

  return (
    <Router>
    <Header loggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<ProfileList />}/>
        <Route path="/login" element={<Login state={handleLoginState}/>}/>
        <Route path="/registration" element={<Registration/>}/>
        <Route path="/create-profile" element={<ProfileCreate />} />
        <Route path="/profile/:id" element={<Profile />}/>
        {isLoggedIn && (<Route path="/edit" element={<ProfileEdit />} />)}
      </Routes>
    </Router>
  );
}

export default App;
