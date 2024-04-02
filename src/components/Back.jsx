import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ title }) {

    const redirect = useNavigate()
    return (
        <div className=''>
            <div className=" ml-8  flex items-center justify-start h-10 my-3">
                <img onClick={() => redirect('/projects')}
                    className=' left-7 size-5 cursor-pointer'
                    src={left}></img>

                <h2 className='text-[19px] font-normal bg-clip-text bg-gradient-to-r line-clamp-1 truncate from-[#111825] via-[#111825] to-[#111825] text-transparent ml-5 capitalize'>{title}</h2>
            </div>
        </div>
    )
}