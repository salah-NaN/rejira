import { useNavigate } from 'react-router-dom'
import left from '../assets/left.svg'


export default function Back({ title }) {

    const redirect = useNavigate()
    return (
        <div className=''>
            <div className=" ml-7  flex items-center justify-center h-10
        sm:my-3">
                <img onClick={() => redirect('/projects')}
                    className='fixed left-7 size-6 cursor-pointer'
                    src={left}></img>

                <h2 className='text-[19px] font-medium tracking-wide bg-clip-text bg-gradient-to-r from-[#111825] via-[#111825] to-[#111825] text-transparent ml-5 capitalize'>{title}</h2>
            </div>
        </div>
        // 5593ff
        // 5593ff

    )
}