import { useRef, useState, useEffect } from "react"
import close from '../assets/close_white.svg';
const URL = 'http://localhost:3000/api'




export default function DropAddTask({ isOpen, setIsOpen, id, trigger, setTrigger}) {
    const [inputs, setInputs] = useState({title: '', type: 'storie'})


    const dropdownRef = useRef(null);

    // useEffects
    // to close the mini-dropdown when you click outside it
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




    // funcs
    const handleInputs = (event) => {
        setInputs({...inputs, [event.target.name]: event.target.value})
    }

    const handleCreateTask = () => {
        // fetch para crear tarea con solo un títlulo
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(inputs)
        }
        fetch(URL + '/tasks/projects/' + id, options)
            .then(res => res.json())
            .then(res => {  
                console.log(res)
                setTrigger(!trigger)
            })
            .catch(err => console.log(err))

        
        setInputs({title: '', type: 'storie'})
    }


    return (

        <div
            className={` ${isOpen ? 'static' : 'hidden'}`} ref={dropdownRef}>
            <div className=" flex flex-col border-[#e5e5e5] bg-[#5896ff] border-2 mx-3 shadow-lg mb-4" >
                <div className="flex justify-between items-center w-10/12 mx-auto mt-2 mb-1">
                    <label className=" text-[15px] text-[#fafafa]" >Add a new task...</label>
                    <img onClick={() => setIsOpen(false)}
                        className="size-4 cursor-pointer" src={close} ></img>
                </div>
                <div className="flex justify-between items-center gap-4 w-10/12 mx-auto">
                    <input onChange={handleInputs}
                        name="title"
                        value={inputs.title}
                        className="w-10/12 mx-auto mb-2 mt-1 pl-1 pb-1 bg-[#5896ff] focus:outline-none focus:border-b-[#eaeaea] transition duration-200 text-light text-[14px] text-[#eaeaea]  border-[#8cb6ff] border-b" >
                    </input>
                    <select name="type" onChange={handleInputs} className="bg-[#5896ff] text-[#fafafa] font-[14px]">
                        <option value='storie' >Storie</option>
                        <option value='bug' >Bug</option>
                        <option value='task' >Task</option>
                    </select>
                </div>
                <button onClick={handleCreateTask}
                    type="button"
                    className="w-fit mx-6 mt-1 mb-3 text-[#fafafa]  bg-[#5896ff]/90 hover:text-[#ffffff]/60 transition duration-200 text-[14px] self-end"
                >Create</button>
            </div>
        </div>

    )
}