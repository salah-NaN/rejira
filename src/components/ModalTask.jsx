import { useEffect, useState } from "react";
import close from '../assets/close.svg';
import tag from '../assets/tag.svg';
const URL = 'http://localhost:3000/api'


export default function ModalTask({ visible, setVisible, editable, setEditable, project_id, trigger, setTrigger }) {

    const [deleteVisible, setDeleteVisible] = useState(false)
    const [tagsVisible, setTagsVisible] = useState(false)
    const [tagInput, setTagInput] = useState('')
    const [commentInput, setCommentInput] = useState({ commentTitle: '', comment: '' })
    const [updateTagComment, setUpdateTagComment] = useState(false)
    const [first, setFirst] = useState(true)

    // useEffects
    useEffect(() => {
        if (!first) {
            const { id } = editable
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
            console.log(editable)
            fetch(URL + '/tasks/' + id, options)
                .then(res => res.json())
                .then(res => {
                    setEditable({
                        id: res.id,
                        title: res.title,
                        type: res.type,
                        description: res.description === null ? '' : res.description,
                        email: !res.Assigned ? '' : res.Assigned.email,
                        priority: res.priority === null ? 'high' : res.priority,
                        comments: res.comments,
                        tags: res.tags
                    })
                })
                .catch(err => console.log(err))
        } else {
            setFirst(false)
        }


    }, [updateTagComment])



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
        console.log(email)
        console.log(restEditable)
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
            .then(res => {
                console.log(res)
                setTrigger(!trigger)

            })
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
                setTrigger(!trigger)
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
                setUpdateTagComment(!updateTagComment)
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
            .then(res => {
                console.log(res)
                setUpdateTagComment(!updateTagComment)
            })
            .catch(err => console.log(err))

    }

    const handleCommentInputs = (event) => {
        setCommentInput({ ...commentInput, [event.target.name]: event.target.value })
    }

    const handleAddComment = () => {
        // fetch to add a comment
        const { commentTitle, comment } = commentInput
        const objComment = { title: commentTitle, comment }
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
                console.log(editable)
                console.log(res)
                setUpdateTagComment(!updateTagComment)
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <div className={` ${visible ? 'fixed' : 'hidden'} top-0 left-0  overflow-y-auto overflow-x-hidden w-full h-dvh  bg-black bg-opacity-50 `}>
                <div className={` ${visible ? 'fixed' : 'hidden'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                w-10/12 h-9/12 bg-[#fafafa] shadow py-6 px-8
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
                        className="flex flex-col flex-wrap mt-7
                        sm:mt-10">
                        <label className=" text-[14px] ">Title</label>
                        <input onChange={handleInputs} name="title" type="text"
                            // value left
                            value={editable.title}
                            className="mb-5 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                        ></input>
                        <label className=" text-[14px] 0">Description</label>
                        <textarea onChange={handleInputs} name="description"
                            value={editable?.description}
                            className="mb-7 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
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
                            {/* button añadir tag */}
                            <div className="w-full my-3 flex gap-3 items-center">
                                <input className=" flex-grow w-1/2 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                    value={tagInput}
                                    onChange={(event) => setTagInput(event.target.value)}
                                    placeholder="Add a tag..."
                                    name="name_tag"
                                ></input>
                                <button className="  px-3 py-1 border-2 border-[#3b82f6] text-[#3b82f6] text-[13px] "
                                    onClick={handleAddTag} type="button" >Add</button>
                                <img onClick={() => setTagsVisible(true)}
                                    className="size-6 cursor-pointer" src={tag} ></img>
                            </div>
                        </div>

                        {/* maquetar los comentarios */}
                        <div className={` flex-none overflow-auto h-32 border border-[#bdd5ff]`}>
                            {editable.comments.map(comment => (
                                <div className="mx-4 my-2 py-1 px-2 flex flex-col w-fit rounded-lg bg-[#88b4ff]"
                                 key={comment.id}>
                                    <h5 className="font-medium text-[15px]">{comment.user.name}</h5>
                                    <h6 className=" text-[14px]" >{comment.title}</h6>
                                    <p className=" text-[13px]" >{comment.comment}</p>
                                </div>
                            ))}
                        </div>
                        {/* añadir comentario */}
                        <div className="">
                            <input className="w-full mt-3 py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                value={commentInput.commentTitle}
                                onChange={handleCommentInputs}
                                placeholder="Title..."
                                name="commentTitle"
                            ></input>
                            <div className="mt-3 flex justify-between items-center gap-3" >
                                <input className="flex-grow py-1 pl-2 focus:outline-none border-b focus:border-b-[#3b82f6] transition duration-200 bg-[#fafafa] text-light text-[15px]"
                                    value={commentInput.comment}
                                    onChange={handleCommentInputs}
                                    placeholder="Comment..."
                                    name="comment"
                                ></input>
                                <button className="  px-3 py-1 border-2 border-[#3b82f6] text-[#3b82f6] text-[13px] "
                                    onClick={handleAddComment} type="button" >Add</button>
                            </div>
                        </div>

                        <div className="flex justify-between mt-5">
                            <button type="button"
                                onClick={() => setDeleteVisible(true)}
                                className="w-fit  px-6 py-1 text-white  bg-red-500/90 hover:bg-[#ff5353]/90 transition duration-200 shadow">
                                Drop
                            </button>
                            <button className="w-fit px-6 py-1 text-white bg-[#3b82f6] hover:bg-[#3b82f6]/90 transition duration-200 shadow"
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


                    {/* tags */}
                    <div className={` ${tagsVisible ? 'fixed' : 'hidden'} top-0 left-0 overflow-y-auto overflow-x-hidden w-full h-full  bg-black bg-opacity-20 `}>
                        <div className={`${tagsVisible ? 'fixed' : 'hidden'}  top-1/2 left-1/2 w-10/12 h-72 bg-[#fafafa] -translate-x-1/2 -translate-y-1/2 z-70`} >
                            <div className="flex flex-col h-full" >
                                <img onClick={() => setTagsVisible(false)}
                                    className="size-4 cursor-pointer self-end mr-4 mt-4 "
                                    src={close}></img>
                                <div className={` w-11/12 flex-grow mx-auto mt-3 mb-4 overflow-auto`}>
                                    {editable.tags.map((tag, index) => <div key={index} className="inline-block ">
                                        <div className="flex justify-between items-center w-fit ml-2 mt-1 px-2 rounded-full bg-[#b5d2ff] text-[#444444] shadow-sm font-sm  truncate">
                                            {'#' + tag.name_tag}
                                            <img onClick={(event) => handleDeleteTag(event, tag.id)}
                                                className="size-3 ml-2 cursor-pointer" src={close} ></img>
                                        </div>

                                    </div>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}