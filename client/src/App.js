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
import ProfileListAdmin from './components/profile-list-admin/ProfileListAdmin';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [show, setShow] = useState(true)
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
    setShow(!value)
  }

  return (
    <Router>
    <Header show={show} loggedIn={isLoggedIn}/>
      <Routes>
        <Route path="/" element={<ProfileList />}/>
        {show && (<Route path="/login" element={<Login state={handleLoginState}/>}/>)}
        {show && (<Route path="/registration" element={<Registration/>}/>)}
        <Route path="/create-profile" element={<ProfileCreate />} />
        <Route path="/profile/:id" element={<Profile />}/>
        {/* {isLoggedIn && (<Route path="/edit" element={<ProfileEdit />} />)} */}
        {isLoggedIn && (<Route path="/admin-panel" element={<ProfileListAdmin />} />)}
      </Routes>
    </Router>
  );
}

export default App;
