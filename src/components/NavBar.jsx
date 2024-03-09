import logo from "../assets/logo.svg"
import Dropdown from "./Dropdown"

export default function NavBar() {

    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
        window.location.href = '/'
    }
    //justify-self-start
    return (

        <>
            <nav className='h-20 w-full flex justify-between items-center pl-10 pr-8 bg-[#ffffff]
            md:pl-20 md:pr-16
            lg:pl-24'>
                <div className="flex justify-center items-center gap-4">
                    <img className="size-10" src={logo}></img>
                    <h1 className="text-2xl font-medium" >Regira</h1>
                    <div className="hidden
                    md:ml-20 md:flex md:gap-10 md:visible">
                        <p>Docs</p>
                        <p>Services</p>
                        <p>About us</p>
                    </div>
                </div>
                
                <Dropdown func={handleLogout} />
            </nav>
        </>

    )
}
