import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ title }) {

    const redirect = useNavigate()
    return (
        <div>
            <div className=" ml-7 my-2.5 flex items-center
        sm:my-3">
                <img onClick={() => redirect('/projects')}
                    className=' size-6 cursor-pointer'
                    src={left}></img>

                <h2 className='text-lg  text-[#232323] ml-4'>{title}</h2>

            </div>
        </div>

    )
}