import React, { useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

export const RegisterUser = () => {

    const navigate = useNavigate()
    
    const location = useLocation().pathname
    const { id } = useParams()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    const [usernameErr, setUsernameErr] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPasswordErr, setConfirmPasswordErr] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        if (location !== '/login') {
            formData.append('confirmPassword', confirmPassword)
            formData.append('email', email)
        }

        try {
            if (location == '/login') {
                const response = await axios.post(`http://localhost:5000/login`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }, { withCredentials: true })
                console.log(response.data.msg)
            } else if (id) {
                const response = await axios.put(`http://localhost:5000/edit_user/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                console.log(response.data.msg)
            } else {
                const response = await axios.post('http://localhost:5000/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                console.log(response.data.msg)
            }
            navigate('/')
        } catch (error) {
            const e = error.response
            if (e && e.status === 400) {
                console.error(e.data)
                setUsernameErr(e.data.username)
                setEmailErr(e.data.email)
                setPasswordErr(e.data.password)
                setConfirmPasswordErr(e.data.confirmPassword)
            } else {
                console.error(error)
            }
        }
    }

  return (
    <div className='flex justify-center items-center h-screen bg-amber-500'>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {location === "/login" ? "Login to Your Account" : "Create an Account"}
            </h2>
            <form onSubmit={handleSubmit} id="registrationForm">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">{location === "/login" ? "Username or Email" : "Username"}
                    </label>
                    <input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text" id="username" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder={`Enter your ${location === "/login" ? "username or email" : "username"}`} required
                    />
                    { usernameErr &&
                        (<p className="text-red-500 text-sm mt-2">{usernameErr}</p>)
                    }
                </div>
                { location !== '/login' && (
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email" required
                    />
                    { emailErr &&
                        <p className="text-red-500 text-sm mt-2">{emailErr}</p>
                    }
                </div>
                )}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" id="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your password"required
                        />
                    { passwordErr &&
                        <p className="text-red-500 text-sm mt-2">{passwordErr}</p>
                    }
                </div>
                { location !== '/login' && (
                <div className="mb-4">
                    <label htmlFor="confirm-password" className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password" id="confirm-password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Confirm your password" required
                    />
                    { confirmPasswordErr &&
                        <p className="text-red-500 text-sm mt-2">{confirmPasswordErr}</p>
                    }
                </div>
                )}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                    {location === "/login" ? "Login" : "Register"}
                </button>
            </form>
            <p className="text-center text-gray-600 mt-4">
                {location === "/login" ? (<>
                    Don't have an account? <a href="/register" className="text-blue-500 font-semibold">Sign Up</a>
                </>) : (<>
                    Already have an account? <a href="/login" className="text-blue-500 font-semibold">Sign In</a>
                </>)}
            </p>

        </div>
    </div>
  )
}


export default RegisterUser