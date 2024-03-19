import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ func }) {

    const redirect = useNavigate()
    return (
        <div className=" ml-7 my-2.5
        sm:my-3">
            <img onClick={() => redirect('/projects')} className='size-6 cursor-pointer'
                src={left}></img>
        </div>
    )
}