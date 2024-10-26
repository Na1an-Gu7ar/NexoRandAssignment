import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  })

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      // Make an API call to register the user
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/register`, formData);

      // Check if registration is successful
      if (response.data.success) {
        const userData = response.data.data;
        login(userData); // Set user data in context
        navigate('/leaderboard'); // Redirect to leaderboard
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className='flex flex-col items-center h-[90vh] justify-center'>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center p-3 border-2 w-[30vw] h-[70vh] rounded-lg'>
        <input type="text" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
        <input type="text" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
        <input type="text" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
        <input type="email" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" className='border-2 border-slate-700 p-2 rounded-md mt-5 w-[70%]' name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit" className='mt-5 bg-purple-500 rounded-md p-1 text-white w-[70px] h-[40px]'>Register</button>
      </form>
    </div>
  )
}

export default Registration
