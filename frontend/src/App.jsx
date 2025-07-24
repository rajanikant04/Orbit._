import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'

import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {
  const {data:authUser,isLoading} = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }
        console.log("authUser is here:",data)
        return data;
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false,
  })

  if(isLoading) {
    return(
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative'>
      {/* Premium background elements */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]'></div>
      
      <div className='flex max-w-7xl mx-auto backdrop-blur-sm relative z-10'>
        {/* common component */}
        {authUser && <Sidebar />}
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" /> } />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
          <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
        </Routes>
        {authUser && <RightPanel />}
        <Toaster 
          toastOptions={{
            className: '',
            style: {
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#fff',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(16px)',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </div>
    </div>
  )
}

export default App
