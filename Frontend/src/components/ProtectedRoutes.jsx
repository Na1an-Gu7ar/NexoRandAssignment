import React, { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const {user} = useContext(AuthContext)
    return user ? children : <Navigate to="/login"/>    
}

export default ProtectedRoutes
