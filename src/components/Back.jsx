import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ func }) {

    const redirect = useNavigate()
    return (
        <div className=" w-full ml-4 my-4">
            <img onClick={() => redirect('/projects')} className='size-7 cursor-pointer'
                src={left}></img>
        </div>
    )
}