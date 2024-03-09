
import { Outlet, Link, useNavigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'


function App() {

  const redirect = useNavigate()

  

  return (
    <>
      <NavBar/>
      <Outlet/>
    </>


  )
}

export default App
