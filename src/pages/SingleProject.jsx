
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import plus from '../assets/add.png';
import DropAddTask from "../components/DropAddTask";
import ModalTask from "../components/ModalTask";
const URL = 'http://localhost:3000/api'


export default function SingleProject() {
    const [tasks, setTasks] = useState([])
    const [parsedtasks, setParsedTasks] = useState([])
    // para el localstorage
    const [execute, setExecute] = useState(false)
    // para el dropdown de añadir tarea
    const [isOpen, setIsOpen] = useState(false)
    const [first, setFirst] = useState(true)
    const [visible, setVisible] = useState(false)
    const [editable, setEditable] = useState({ id: -1, title: '', description: '', type: 'storie', priority: 'high', email: '' })




    // constants 
    const { id: project_id } = useParams()
    const tables = ['backlog', 'ready', 'in progress', 'review', 'testing', 'done']
    // const Tasks = ['arreglar bug', 'crear endpoint', 'cambiar boton']


    // useEffects

    // solicitar todas las tareas de ese proyecto
    useEffect(() => {
        // solicitar todas las tareas
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + `/tasks/projects/${project_id}`, options)
            .then(res => res.json())
            .then(res => {
                // si el codigo funciona, funciona, no se toca
                res.sort((a, b) => a.order - b.order)
                setTasks(res)
            })
            .catch(err => console.log(err))


    }, [])

    // cada vez de cambia el orden de las tareas se hace un fetch para guardar en bd
    useEffect(() => {

        // las tareas actualizadas con su orden y su stage
        const beforeSave = tasks.map((task, index) => {
            return { id: task.id, stage: task.stage, order: index }
        })

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(beforeSave)
        }
        fetch(URL + '/tasks/order', options)
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }, [tasks])



    // funcs 
    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result

        // tasks clone
        const clone = [...tasks]

        if (source.droppableId === destination.droppableId) {
            const allowed = clone.filter(task => task.stage == destination.droppableId)
            const notAllowed = clone.filter(task => task.stage != destination.droppableId)
            const [draggedTask] = allowed.splice(source.index, 1)
            allowed.splice(destination.index, 0, draggedTask)
            setTasks([...notAllowed, ...allowed])
        } else {
            const origin = clone.filter(task => task.stage == source.droppableId)
            const dest = clone.filter(task => task.stage === destination.droppableId)
            const rest = clone.filter(task => (task.stage != destination.droppableId) && (task.stage != source.droppableId))
            const [draggableTask] = origin.splice(source.index, 1)
            draggableTask.stage = destination.droppableId
            dest.push(draggableTask)
            setTasks([...rest, ...origin, ...dest])
        }
    }

    const handleOpenModalAndEdit = (event, id) => {
        //open modal
        setVisible(true)

        // fetch to set the info task to edit
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + '/tasks/' + id, options)
            .then(res => res.json())
            .then(res => {

                setEditable({
                    id: res.id,
                    title: res.title,
                    type: res.type,
                    description: res.description === null ? '' : res.description,
                    email: res.user_id === null ? '' : res["Assigned.email"],
                    priority: res.priority === null ? 'high' : res.priority
                })
            })
            .catch(err => console.log(err))
    }

    // mostrar el kanban
    // tailwind stuff: bg-red-500/70 bg-orange-500/70  bg-gray-500/70
    return (
        <>
            <div className="px-5 flex gap-7 overflow-x-scroll h-lvh">
                <DragDropContext className="flex gap-7 overflow-x-scroll"
                    onDragEnd={handleDragEnd}>
                    {
                        tables.map(table => (
                            <div key={table} >
                                <h3 className="pt-3 border-t-2 border-r-2 border-l-2 border-t-gray-300 border-r-gray-300 border-l-gray-300 bg-[#5593ff] text-2xl text-[#e8e8e8] font-semibold text-center" >{table}</h3>

                                <Droppable key={table} droppableId={table}>
                                    {(provided) => (
                                        <ul
                                            className={`pt-4 ${table === 'backlog' ? 'border-r-2 border-l-2 pb-1 border-r-gray-300 border-l-gray-300' : 'border-b-2 border-r-2 border-l-2 border-b-gray-300 border-r-gray-300 border-l-gray-300'} min-w-[260px] h-fit bg-[#5593ff]`}
                                            {...provided.droppableProps} ref={provided.innerRef}>
                                            {tasks
                                                .filter(task => task.stage === table)
                                                .map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <li className="border-[#e5e5e5] bg-[#88b4ff] border-2 pt-3 pb-1 mb-4 mx-3 shadow-lg"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            // onClick={handleOpenModalAndEdit voy a probar a ver si funcina mejor con el edit}

                                                            >
                                                                <div className="mx-2 flex justify-between font-medium text-[#f8f8f8]">
                                                                    <h4 className="">{task.title}</h4>
                                                                    <div className={`size-5 ml-3 bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'gray'}-500/70 rounded-full shrink-0 shadow-sm`}></div>
                                                                </div>
                                                                <p className="ml-2 text-[13px] text-gray-100">{task.Assigned?.name}</p>
                                                                {/* {task.tags} */}
                                                                <div className="mt-1 mr-8">
                                                                    {task.tags.map((tag, index) => <div key={index} className="inline-block w-fit ml-2 mt-1 px-2 rounded-full bg-[#e5e5e5] text-[#444444] shadow-sm font-sm  truncate">{'#' + tag.name_tag}</div>)}
                                                                </div>
                                                                <button onClick={(event) => handleOpenModalAndEdit(event, task.id)}
                                                                    className=" w-fit px-2  text-[13px] font-semibold text-[#dadada] hover:border-[#ebebeb] hover:text-[#ebebeb] transition duration-200" >Edit</button>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>

                                {table === 'backlog' ?
                                    (
                                        <div className="bg-[#5593ff] min-w-[260px] border-b-2 border-r-2 border-l-2 border-b-gray-300 border-r-gray-300 border-l-gray-300">
                                            <div onClick={() => setIsOpen(true)}
                                                className=" flex justify-center items-center border-[#e5e5e5] bg-[#88b4ff] border-2 mx-3 shadow-lg py-2 mb-4 cursor-pointer hover:bg-[#76a8ff] transition duration-200" >
                                                <img className="size-5 p-0"
                                                    src={plus}></img>
                                            </div>


                                            <DropAddTask tasks={tasks} setTasks={setTasks} isOpen={isOpen} setIsOpen={setIsOpen} id={project_id} />
                                        </div>

                                    )
                                    :
                                    null}
                            </div>

                        ))
                    }
                </DragDropContext>
            </div>
            <ModalTask visible={visible} setVisible={setVisible} editable={editable} setEditable={setEditable} project_id={project_id}/>
        </>

    )
}


