import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ func }) {

    const redirect = useNavigate()
    return (
        <div className=" w-full ml-7 my-2.5">
            <img onClick={() => redirect('/projects')} className='size-5 cursor-pointer
            sm:size-6'
                src={left}></img>
        </div>
    )
}