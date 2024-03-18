import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.svg"
import Dropdown from "./Dropdown"
import { useContext, useEffect } from "react"
import Context from "../util/Context"



export default function NavBar() {
    const { logged, setLogged, handleLogout } = useContext(Context)

    // constants
    const redirect = useNavigate()



    // funcs
    const handleRedirect = () => {
        if (document.cookie.includes('token')) redirect('/projects')
    }
    //justify-self-start
    return (

        <>
            <nav className='h-20 w-full flex justify-between items-center pl-10 pr-8 bg-[#ffffff]
            md:pl-20 md:pr-16
            lg:pl-24'>
                <div className="flex justify-center items-center gap-4">
                    <div className="flex justify-center items-center gap-4 cursor-pointer" onClick={handleRedirect}>
                        <img className="size-10" src={logo}></img>
                        <h1
                            className="text-2xl font-normal" >Regira</h1>
                    </div>

                    <div className="hidden
                    md:ml-20 md:flex md:gap-10 md:visible">
                        <a href="#" >Docs</a>
                        <a href="#" >Services</a>
                        <a href="#" >About us</a>
                    </div>
                </div>

                {
                    logged
                        ?
                        <Dropdown func={handleLogout} />
                        :
                        null
                }
            </nav>
        </>

    )
}
