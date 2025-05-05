import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { useState,  useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DevicesList from './homePage/DevicesList'
import AddDevice from './homePage/AddDevice'
import DeleteDevice from './homePage/DeleteDevice'

import RegisterUser from './userPage/RegisterUser'



function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)

  axios.defaults.withCredentials = true

  useEffect(() => {
    axios.get("http://localhost:5000/me", { withCredentials: true })
      .then(response => {
        const res = response.data
        console.log(res)
        setUser(res.isLoggedIn)
      })
      .catch(error => console.error("Session tidak ditemukan", error))
  }, [])


  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<DevicesList userLog={user} setUserLog={setUser} />} > 
            <Route path="add_device" element={<AddDevice />} />
            <Route path="edit_device/:id" element={<AddDevice />} />
            <Route path="delete_device/:id" element={<DeleteDevice />} />
          </Route>
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<RegisterUser />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
