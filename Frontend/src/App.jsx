import { AuthContextProvider } from './context/authContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import Leaderboard from './pages/Leaderboard/Leaderboard'
import ProtectedRoutes from './components/ProtectedRoutes'
import Navbar from './components/Navbar'

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/leaderboard' element={
            <ProtectedRoutes>
              <Leaderboard />
            </ProtectedRoutes>
          } />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
