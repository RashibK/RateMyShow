import './App.css';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';

function App() {
  return (
  <>
  <Routes>
    
    <Route path='/login' element={<Login />} />
    
    <Route element={<PrivateRoutes />}>
    <Route path='/' element = {<HomePage />} />
    </Route>

  </Routes>
  </>
  )
}

export default App
