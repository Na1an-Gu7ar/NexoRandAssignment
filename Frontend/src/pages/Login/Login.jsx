import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(''); // Clear previous errors
      
      try {
        // Make an API call to the backend login route
        const response = await fetch("https://nexo-rand-backend.vercel.app/api/auth/v1/login", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (!data.success) {
          setError(data.message); // Display error message if login fails
          return;
        }
  
        // Call context login function and store user data in context/local storage
        login(data.data);
        localStorage.setItem('token', data.token); // Store the token in local storage
        navigate('/leaderboard'); // Redirect to the Leaderboard page after login
  
      } catch (err) {
        setError('An error occurred while logging in. Please try again.');
        console.error('Error during login:', err);
      }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

  return (
    <div className='flex flex-col items-center h-[80vh] justify-center'>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center p-3 border-2 w-[30vw] h-[45vh] rounded-lg'>
        <input type="text" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input type="password" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit" className='mt-5 bg-purple-500 rounded-md p-1 text-white w-[60px] h-[40px]'>Login</button>
      </form>
    </div>
  )
}

export default Login
