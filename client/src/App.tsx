import React,{ useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './Components/UserContral/Login'
import { Account } from './Components/UserContral/Account'
import Status from './Components/UserContral/Status';
import TopPage from './Components/TopPage';

function App() {

  return (
    <>
    <Router>
      <Account> 
        <Routes>
          <Route path="/" element={<Status />} />
          <Route path="/login" element={<Login />} />
          <Route path="/topPage" element={<TopPage />} />
        </Routes>
      </Account>
    </Router>   
    </>
  )
}

export default App
