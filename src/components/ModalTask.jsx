import { useEffect, useState } from "react";
import close from '../assets/close.svg';
const URL = 'http://localhost:3000/api'


export default function ModalTask({ visible, setVisible, editable, setEditable, project_id }) {

    const [deleteVisible, setDeleteVisible] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const [commentInput, setCommentInput] = useState({ commentTitle: '', comment: '' })

    // funcs
    const handleOpenModal = (event) => {
        setVisible(!visible)
    }


    const handleInputs = (event) => {
        // set editable inputs
        setEditable({ ...editable, [event.target.name]: event.target.value })
    }


    const handleSubmitEdit = (event) => {
        event.preventDefault();
        console.log(editable)
        const { id, email, ...restEditable } = editable

        // fetch to update a a task
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(restEditable)
        }
        fetch(URL + '/tasks/' + id, options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))

        // close modal
        setVisible(false)
    }

    const handleDropTask = (event) => {
        event.preventDefault()
        const { id } = editable

        // fetch to delete the a task
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + '/tasks/' + id + '/projects/' + project_id, options)
            .then(res => res.json())
            // i must control errors and the view part
            .then(res => {
                setDeleteVisible(false)
                setVisible(false)
            })
            .catch(err => console.log(err))
    }

    const handleAddTag = () => {
        const { id } = editable
        const objTag = { name_tag: tagInput }
        // fetch to add a tag associated to a task
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(objTag)
        }
        fetch(URL + '/tags/projects/' + project_id + '/tasks/' + id, options)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))
    }

    const handleDeleteTag = (event, id) => {
        event.preventDefault()
        const { id: task_id } = editable


        // fetch to delete the a tag
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + '/tags/' + id + '/projects/' + project_id + '/tasks/' + task_id, options)
            .then(res => res.json())
            // i must control errors and the view part
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))

    }

    const handleCommentInputs = (event) => {
        setCommentInput({ ...commentInput, [event.target.name]: event.target.value })
    }

    const handleAddComment = () => {
        // fetch to add a comment
        const {commentTitle, comment} = commentInput
        const objComment = {title: commentTitle, comment}
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(objComment)
        }
        fetch(URL + `/comments/tasks/${editable.id}/projects/${project_id}`, options)
            .then(res => res.json())
            .then(res => {
                console.log(res)
            })
            .catch(err => console.log(err))


    }

    return (
        <>
            <div className={` ${visible ? 'fixed' : 'hidden'} top-0 left-0  overflow-y-auto overflow-x-hidden w-full h-dvh  bg-black bg-opacity-50 `}>
                <div className={` ${visible ? 'fixed' : 'hidden'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                w-10/12 h-[420px] bg-[#fafafa] shadow py-6 px-8
                sm:w-3/5
                md:w-2/5
                lg:w-1/3`}>
                    <div className="flex justify-between items-center ">
                        <h3 className="text-2xl font-semibold " >Edit task</h3>
                        <img onClick={() => setVisible(false)}
                            className="size-5 cursor-pointer"
                            src={close}></img>
                    </div>
                    <form onSubmit={handleSubmitEdit}
                        className="flex flex-col flex-wrap mt-10">
                        <label className=" text-[14px] ">Title</label>
                        <input onChange={handleInputs} name="title" type="text"
                            // value left
                            value={editable.title}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></input>
                        <label className=" text-[14px] 0">Description</label>
                        <textarea onChange={handleInputs} name="description"
                            value={editable?.description}
                            className="mb-10 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></textarea>
                        <div className="mb-4 flex items-center gap-y-4 gap-x-3 ">
                            <select value={editable.type} name="type" onChange={handleInputs} className="bg-[#fafafa] text-[#131313] font-[14px]">
                                <option value='storie' >Storie</option>
                                <option value='bug' >Bug</option>
                                <option value='task' >Task</option>
                            </select>
                            <select value={editable.priority} name="priority" onChange={handleInputs} className="bg-[#fafafa] text-[#131313] font-[14px]">
                                <option value='high' >High</option>
                                <option value='medium' >Medium</option>
                                <option value='low' >Low</option>
                            </select>
                            <input value={editable.email} className="w-full py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                onChange={handleInputs}
                                placeholder="Assigned to..."
                                name="email"
                            ></input>
                        </div>
                        {/* maquetar los tags */}
                        <div className="flex flex-col">
                            {/* <div className={`relative mt-1 w-full flex-none overflow-auto h-16`}>
                                {editable.tags.map((tag, index) => <div key={index} className="inline-block ">
                                    <div className="flex justify-between items-center w-fit ml-2 mt-1 px-2 rounded-full bg-[#e5e5e5] text-[#444444] shadow-sm font-sm  truncate">
                                        {'#' + tag.name_tag}
                                        <img onClick={(event) => handleDeleteTag(event, tag.id)}
                                            className="size-3 ml-3 cursor-pointer" src={close} ></img>
                                    </div>

                                </div>)}
                            </div> */}

                            {/* button añadir tag */}
                            <div className="w-full">
                                <input className="mt-3 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    placeholder="Add a tag..."
                                    name="name_tag"
                                ></input>
                                <button onClick={handleAddTag} type="button" >Add</button>
                            </div>
                        </div>

                        {/* maquetar los comentarios */}
                        <div className={`flex-none overflow-auto h-28`}>
                            {editable.comments.map(comment => (
                                <div key={comment.id}>
                                    <h5>{comment.user.name}</h5>
                                    <h6>{comment.title}</h6>
                                    <p>{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                        {/* añadir comentario */}
                        <div>
                            <input className="mt-3 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                value={commentInput.commentTitle}
                                onChange={handleCommentInputs}
                                placeholder="Title..."
                                name="commentTitle"
                            ></input>
                            <input className="mt-3 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                value={commentInput.comment}
                                onChange={handleCommentInputs}
                                placeholder="Comment..."
                                name="comment"
                            ></input>
                            <button type="button"
                                onClick={handleAddComment}>Add</button>
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
                            <h3 className="mt-3 text-center text-[15px] font-medium">You want to drop the task?</h3>
                            <div className="mt-4 flex justify-evenly" >
                                <button type="button"
                                    onClick={() => setDeleteVisible(false)}
                                    className="w-fit px-6 py-1 text-white bg-[#aeaeae] hover:bg-[#aeaeae]/90 transition duration-200"
                                >Cancel</button>
                                <button type="button"
                                    onClick={handleDropTask}
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