import { useState } from "react"
import { useNavigate } from "react-router-dom"
const URL = 'http://localhost:3000/api'

const initial = {
    email: '',
    password: ''
}


const Login = () => {
    const [inputs, setInputs] = useState(initial)


    // constants
    const redirect = useNavigate()


    // funcs 
    const handleForm = (event) => {
        const { name, value } = event.target
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    // making a login request 
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(inputs)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs),
            credentials: 'include'
        }
        fetch(URL + '/login', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))

        redirect('/projects')
        // to reset the form values
        setInputs(initial)
    }

    return (
        <>


            <div className="flex flex-col items-center w-[360px] mx-auto my-28 p-12 bg-white shadow-2xl text-gray-800
            sm:w-[360px] sm:my-30">
                <h1 className="w-full mb-3 text-4xl font-light" >Welcome</h1>
                <p className="w-full mb-8 text-[12px] text-gray-400 font-medium" >Log into your account</p>
                <form className="w-full flex flex-col"
                    onSubmit={handleSubmit}>
                    <label className="text-[12px]" >Email</label>
                    <input className="mb-5 py-1 pl-2 border-b border-gray-200 focus:outline-none focus:border-b-blue-500 transition duration-200 text-light text-[15px]"
                        type='text' name="email" onChange={handleForm} value={inputs["email"]}></input>
                    <label className="text-[12px] " >Password</label>
                    <input className="mb-4 py-1 pl-2 border-b border-gray-200 focus:outline-none focus:border-b-blue-500 transition duration-200 text-[15px]"
                        type='password' name="password" onChange={handleForm} value={inputs["password"]} ></input>
                        {/* change to link and redirect */}
                    <button className=" w-fit self-end text-[12px] mb-5 text-gray-700 hover:text-gray-400">Forgot password?</button>
                    <button className="py-1 px-3 bg-blue-500 text-white hover:bg-blue-500/80 transition duration-200 ">Submit</button>
                </form>

            </div>




            {/* <h1>Register</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input name="email" onChange={handleForm} value={inputs["email"]}></input>
                    <label>Password</label>
                    <input name="password" onChange={handleForm} value={inputs["password"]} ></input>
                    <button>Enter</button>
                </form>
            </div> */}
        </>
    )
}

export default Login


// color to change: 
/*
- input borders
*/