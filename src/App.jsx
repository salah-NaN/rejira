
import { Outlet, Link, useNavigate } from 'react-router-dom'
import Context from './util/Context'
import './App.css'
import NavBar from './components/NavBar'
import { useEffect, useState } from 'react'
const URL = 'http://localhost:3000/api'


function App() {
  const [logged, setLogged] = useState(null)

  // useEffects
  useEffect(() => {
    // fetch para comprobar que el usuario está logueado
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }
    if (document.cookie.includes('token')) {
      fetch(URL + '/refresh', options)
        .then(res => res.json())
        .then(res => {
          if (res.error || res.message == 'Unauthorized') {
            handleLogout()
          } else {
            setLogged(res)
          }
        })
        .catch(err => console.log(err))
    }
  }, [])

  // funcs
  // to log out
  function handleLogout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    setLogged(null)
    window.location.href = '/'
  }

  const data = {
    logged,
    setLogged,
    handleLogout,
  }

  // execution zone
  // no funciona bien
  // window.history.replaceState(null, null, "/");



  return (
    <Context.Provider value={data}>
      <NavBar />
      <Outlet />
    </Context.Provider>


  )
}

export default App
