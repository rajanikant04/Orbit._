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
import { ThemeProvider } from './utils/ThemeContext'

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
      <ThemeProvider>
        <div className='min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-900'>
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size='lg' />
            <div className="text-white/60 text-sm font-medium">Loading Orbit...</div>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 transition-colors duration-300'>
        <div className='flex max-w-7xl mx-auto relative'>
          {/* Sidebar */}
          {authUser && <Sidebar />}
          
          {/* Main Content */}
          <main className={`flex-1 ${authUser ? 'max-w-2xl' : 'w-full'} border-x border-gray-200/50 dark:border-white/12 transition-colors duration-300`}>
            <Routes>
              <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" /> } />
              <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
              <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
              <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
              <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
            </Routes>
          </main>
          
          {/* Right Panel */}
          {authUser && <RightPanel />}
          
          {/* Toast Notifications */}
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
