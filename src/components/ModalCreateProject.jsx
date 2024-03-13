import { useEffect, useState } from "react";
import close from '../assets/close.svg';
const URL = 'http://localhost:3000/api'


export default function ModalCreateProject({ visible, setVisible, newProject, setNewProject, projects, setProjects }) {

    // funcs
    const handleOpenModal = (event) => {
        setVisible(!visible)
    }


    const handleInputs = (event) => {
        if (event.target.name === 'active') {
            setNewProject({ ...newProject, ["active"]: event.target.checked ? 1 : 0 })
        } else {
            setNewProject({ ...newProject, [event.target.name]: event.target.value })
        }

    }
    const handleSubmit = (event) => {
        event.preventDefault();

        // fetch to create a project
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject),
            credentials: 'include'
        }
        fetch(URL + '/projectsByUser', options)
            .then(res => res.json())
            .then(res => setProjects([...projects, res]))
            .catch(err => console.log(err))

        


        // refresh inputs
        setNewProject({ title: '', description: '', active: 0 })

        // when you click on create close modal
        setVisible(false)

    }


    return (
        <>
            <div className={` ${visible ? 'fixed' : 'hidden'} top-0 left-0  overflow-y-auto overflow-x-hidden w-full h-dvh  bg-black bg-opacity-50 `}>
                <div className={` ${visible ? 'fixed' : 'hidden'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                w-10/12 h-[380px] bg-[#fafafa] shadow py-6 px-8
                md:w-1/3`}>
                    <div className="flex justify-between items-center ">
                        <h3 className="text-2xl font-semibold " >New project</h3>
                        
                        <img onClick={() => setVisible(false)}
                            className="size-5 cursor-pointer"
                            src={close}></img>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col mt-10">
                        <label className=" text-[14px] ">Title</label>
                        <input onChange={handleInputs} name="title" type="text"
                            value={newProject["title"]}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></input>
                        <label className=" text-[14px] 0">Description</label>
                        <textarea onChange={handleInputs} name="description"
                            value={newProject["description"]}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></textarea>
                        <div className="flex items-center mb-5">
                            <label className="mr-5 text-[14px] ">Active</label>
                            <input onChange={handleInputs} name="active"
                                checked={newProject["active"] === 1}
                                className="bg-[#fafafa]" type="checkbox" ></input>
                        </div>
                        <button className="w-fit mt-4 px-6 py-1 self-end text-white bg-[#3b82f6] hover:bg-[#3b82f6]/90 transition duration-200"
                            onChange={handleOpenModal}>
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}