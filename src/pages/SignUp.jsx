import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SignUp() {
    const [inputs, setInputs] = useState({ name: '', email: '', password: '' })

    // constants
    const redirect = useNavigate()
    const URL = 'http://localhost:3000/api'



    // funcs 
    const handleForm = (event) => {
        const { name, value } = event.target
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        // check data
        console.log(inputs)

        // fetch to register new user
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(inputs)
        }
        fetch(URL + '/register', options)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))

        // clear inputs
        setInputs({ name: '', email: '', password: '' })

        // redirect to login => '/' pathname
        redirect('/')
    }


    return (
        <>


            <div className="select-none flex flex-col items-center w-[360px] mx-auto my-24 p-12 bg-white shadow-2xl text-gray-800
            sm:w-[360px] sm:my-30
            lg:my-20">
                <h1 className="w-full mb-3 text-4xl font-light" >Sign Up</h1>
                <p className="w-full mb-8 text-[12px] text-gray-500 font-medium" >Create a new account</p>
                <form className="w-full flex flex-col"
                    onSubmit={handleSubmit}>
                    <label className="text-[12px]" >Name</label>
                    <input className="mb-5 py-1 pl-2 border-b border-gray-200 focus:outline-none focus:border-b-[#3b82f6] transition duration-200 text-light text-[15px]"
                        type='text' name="name" onChange={handleForm} value={inputs["name"]}></input>
                    <label className="text-[12px]" >Email</label>
                    <input className="mb-5 py-1 pl-2 border-b border-gray-200 focus:outline-none focus:border-b-[#3b82f6] transition duration-200 text-light text-[15px]"
                        type='text' name="email" onChange={handleForm} value={inputs["email"]}></input>
                    <label className="text-[12px] " >Password</label>
                    <input className="mb-4 py-1 pl-2 border-b border-gray-200 focus:outline-none focus:border-b-[#3b82f6] transition duration-200 text-[15px]"
                        type='password' name="password" onChange={handleForm} value={inputs["password"]} ></input>
                    {/* change to link and redirect */}
                    <button type="button"
                        onClick={() => redirect('/')}
                        className=" w-fit self-end text-[12px] mb-5 text-gray-700 hover:text-gray-400 transition duration-200">Already have an account?</button>
                    <button className="py-1 px-3 bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 transition duration-200">Submit</button>
                </form>

            </div>
        </>
    )
}