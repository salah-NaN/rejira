import { useEffect, useState } from "react";
import close from '../assets/close.svg';
const URL = 'http://localhost:3000/api'


export default function ModalEditProject({ visible, setVisible, editable, setEditable, projects, setProjects }) {

    const [deleteVisible, setDeleteVisible] = useState(false)

    // funcs
    const handleOpenModal = (event) => {
        setVisible(!visible)
    }


    const handleInputs = (event) => {
        if (event.target.name === 'active') {
            setEditable({ ...editable, ["active"]: event.target.checked ? 1 : 0 })
        } else {
            setEditable({ ...editable, [event.target.name]: event.target.value })
        }
    }

    const handleSubmitEdit = (event) => {
        event.preventDefault();

        const { id, title, description, active } = editable
        const editableToSend = { title, description, active }

        // fetch to update a project
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editableToSend),
            credentials: 'include'
        }
        fetch(URL + '/projects/' + id, options)
            .then(res => res.json())
            .then(res => {
                let indexToAdd = -1
                const projectToUpdate = projects.filter((project, index) => {
                    if (project.id === id) indexToAdd = index
                    return project.id != id
                })
                projectToUpdate.splice(indexToAdd, 0, res)

                setProjects(projectToUpdate)
            })
            .catch(err => console.log(err))
        // close modal
        setVisible(false)
    }

    const handleDrop = (event) => {
        event.preventDefault()

        const {id} = editable

        // fetch to delete the project
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + '/projects/' + id, options)
            .then(res => res.json())
            // i must control errors and the view part
            .then(res => {
                setDeleteVisible(false)
                setVisible(false)

                setProjects(projects.filter(project => project.id != id))
            })
            .catch(err => console.log(err))
    }


    return (
        <>
            <div className={`select-none ${visible ? 'fixed' : 'hidden'} top-0 left-0  overflow-y-auto overflow-x-hidden w-full h-dvh  bg-black bg-opacity-50 `}>
                <div className={` ${visible ? 'fixed' : 'hidden'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                w-10/12 h-[390px] bg-[#fafafa] shadow py-6 px-8
                sm:w-3/5
                md:w-2/5
                lg:w-1/3`}>
                    <div className="flex justify-between items-center ">
                        <h3 className="text-2xl font-semibold " >Edit project</h3>
                        <img onClick={() => setVisible(false)}
                            className="size-5 cursor-pointer"
                            src={close}></img>
                    </div>
                    <form onSubmit={handleSubmitEdit}
                        className="flex flex-col mt-10">
                        <label className=" text-[14px] ">Title</label>
                        <input onChange={handleInputs} name="title" type="text"
                            value={editable["title"]}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></input>
                        <label className=" text-[14px] 0">Description</label>
                        <textarea onChange={handleInputs} name="description"
                            value={editable["description"]}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></textarea>
                        <div className="flex items-center mb-5">
                            <label className="mr-5 text-[14px] ">Active</label>
                            <input onChange={handleInputs} name="active"
                                checked={editable["active"] === 1}
                                className="bg-[#fafafa]" type="checkbox" ></input>
                        </div>
                        <div className="flex justify-between mt-5">
                            <button type="button"
                                onClick={() => setDeleteVisible(true)}
                                className="w-fit  px-6 py-1 text-white  bg-red-500/90 hover:bg-[#ff5353]/90 transition duration-200">
                                Drop
                            </button>
                            <button className="w-fit px-6 py-1 text-white bg-[#3b82f6] hover:bg-[#3b82f6]/90 transition duration-200"
                                onChange={handleOpenModal}>
                                Save
                            </button>
                        </div>
                    </form>

                    <div className={` ${deleteVisible ? 'fixed' : 'hidden'} top-0 left-0 overflow-y-auto overflow-x-hidden w-full h-full  bg-black bg-opacity-20 `}>
                        <div className={`${deleteVisible ? 'fixed' : 'hidden'}  top-1/2 left-1/2 w-10/12 h-24 bg-[#fafafa] -translate-x-1/2 -translate-y-1/2 z-70`} >
                            <h3 className="mt-3 text-center text-[15px] font-medium">You want to drop the project?</h3>
                            <div className="mt-4 flex justify-evenly" >
                                <button type="button"
                                    onClick={() => setDeleteVisible(false)}
                                    className="w-fit px-6 py-1 text-white bg-[#aeaeae] hover:bg-[#aeaeae]/90 transition duration-200"
                                >Cancel</button>
                                <button type="button"
                                    onClick={handleDrop}
                                    className="w-fit  px-6 py-1 text-white  bg-red-500/90 hover:bg-[#ff5353]/90 transition duration-200"
                                >Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}