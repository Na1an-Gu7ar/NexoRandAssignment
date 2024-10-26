import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
      <nav className="bg-slate-800 p-4">
        <ul className="flex justify-start space-x-6">
          <li>
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          </li>
          <li>
            <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
          </li>
          <li>
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
