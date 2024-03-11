import { useRef, useState, useEffect} from "react"
import arrow from '../assets/button.svg';



export default function Dropdown({ func: handleLogout }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null);

    // useEffects
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    return (
        <div ref={dropdownRef}>
            <button
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <img className="size-4" src={arrow} ></img>

                <ul className={` absolute top-5 -right-3 w-38 ${isOpen ? 'visible' : 'hidden'} bg-[#ffffff] shadow-lg  text-gray-900`}>
                    <li className="px-14 py-2 w-full hover:bg-[rgb(207,207,207)] transition duration-200" >Settings</li>
                    <li className={` px-14 py-2 w-full hover:bg-[#cfcfcf] text-red-600 transition duration-200`}
                        onClick={handleLogout} to='/' >Log out</li>
                </ul>
            </button>

        </div>
    )
}