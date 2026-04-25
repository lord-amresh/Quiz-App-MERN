import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup';
import MyResult from './components/MyResult';
import MyResultPage from './pages/MyResultPage';

// Privated protected routes
function RequiredAuth({ children }) {
  const isloggedIn = Boolean(localStorage.getItem('authToken'));
  const location = useLocation();

  if (!isloggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      <Route path='/result' element={
        <RequiredAuth>
          <MyResultPage />
        </RequiredAuth> 
      } 
      />
    </Routes>
  );
};

export default App