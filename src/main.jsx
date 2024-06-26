import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Projects from './pages/Projects.jsx'
import SingleProject from './pages/SingleProject.jsx'
import SignUp from './pages/SignUp.jsx'


const Root = () => {


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} >
                    <Route index element={<Login />} ></Route>
                    <Route path='/signup' element={<SignUp/>} ></Route>
                    <Route path='/projects' element={<Projects />} ></Route>
                    <Route path='/projects/:id' element={<SingleProject />} ></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}





ReactDOM.createRoot(document.getElementById('root')).render(
    <Root />
)
