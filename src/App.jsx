
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import Context from './util/Context'
import './App.css'
import NavBar from './components/NavBar'
import { useEffect, useState } from 'react'
const URL = 'http://localhost:3000/api'


function App() {
  const [logged, setLogged] = useState(null)

  // constants
  const location = useLocation()


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

  useEffect(() => {
    // ask if actual location is '/' and cookie isnt set
    if (location.pathname === '/') {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
      setLogged(null)
      window.history.replaceState(null, null, "/");

      // falta meter el useHistory para limpiar el historial cuando el pathname
      // es login
    }
  }, [location])

  // funcs
  // to log out
  function handleLogout() {
    window.location.href = '/'
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    setLogged(null)
    window.history.replaceState(null, null, "/");
  }

  const data = {
    logged,
    setLogged,
    handleLogout,
  }

  // execution zone
  // no funciona bien



  return (
    <Context.Provider value={data}>
      <NavBar />
      <Outlet />
    </Context.Provider>


  )
}

export default App
