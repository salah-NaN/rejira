
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import plus from '../assets/add.png';
import DropAddTask from "../components/DropAddTask";
import ModalTask from "../components/ModalTask";
import Back from "../components/Back";
const URL = 'http://localhost:3000/api'


export default function SingleProject() {
    const [tasks, setTasks] = useState([])
    const [parsedtasks, setParsedTasks] = useState([])
    // para el dropdown de añadir tarea
    const [isOpen, setIsOpen] = useState(false)
    const [first, setFirst] = useState(true)
    const [isBegin, setIsBegin] = useState(true)
    const [isBegin1, setIsBegin1] = useState(true)
    const [flag, setFlag] = useState(true)
    const [visible, setVisible] = useState(false)
    const [editable, setEditable] = useState({ id: -1, title: '', description: '', type: 'storie', priority: 'medium', email: '', comments: [], tags: [] })
    const [emptyState, setEmptyState] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [titleProject, setTitleProject] = useState('')




    // constants 
    const { id: project_id } = useParams()
    const tables = ['backlog', 'ready', 'in progress', 'review', 'testing', 'done']
    // const Tasks = ['arreglar bug', 'crear endpoint', 'cambiar boton']


    // useEffects
    
    // actualizar al instante los tags y comments
    useEffect(() => {
        if( !isBegin ) {
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
        } else {
            setIsBegin(false)
        }
    }, [trigger])
    
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
                console.log(res)
                setTasks(res)
            })
            .catch(err => console.log(err))

        // fetch to get project name
        fetch(URL + '/allProjects/' + project_id, options)
            .then(res => res.json())
            .then(res => setTitleProject(res.title))
            .catch(err => console.log(err))
    }, [])


    // cada vez de cambia el orden de las tareas se hace un fetch para guardar en bd
    useEffect(() => {
        // las tareas actualizadas con su orden y su stage
        if(!isBegin1){
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
        } else {
            setIsBegin1(!isBegin1)
        }
        

        
    }, [flag])




    // funcs 
    const handleDragEnd = (result) => {
        console.log(result)
        if (!result.destination) return;
        const { source, destination, draggableId } = result

        // tasks clone
        const clone = [...tasks]
        console.log('clone')
        console.log(clone)
        if (source.droppableId === destination.droppableId) {
            const allowed = clone.filter(task => task.stage == destination.droppableId)
            const notAllowed = clone.filter(task => task.stage != destination.droppableId)
            const [draggedTask] = allowed.splice(source.index, 1)
            allowed.splice(destination.index, 0, draggedTask)
            setTasks([...notAllowed, ...allowed])
            // new lines
            setFlag(!flag)
        } else {
            const origin = clone.filter(task => task.stage == source.droppableId)
            const dest = clone.filter(task => task.stage === destination.droppableId)
            const rest = clone.filter(task => (task.stage != destination.droppableId) && (task.stage != source.droppableId))
            const [draggableTask] = origin.splice(source.index, 1)
            draggableTask.stage = destination.droppableId
            dest.splice(destination.index, 0, draggableTask)
            setTasks([...rest, ...origin, ...dest])
            // new lines
            setFlag(!flag)
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
                    email: !res.Assigned ? '' : res.Assigned.email,
                    priority: res.priority === null ? 'low' : res.priority,
                    comments: res.comments,
                    tags: res.tags
                })
            })
            .catch(err => console.log(err))
    }

    // mostrar el kanban
    // tailwind stuff: bg-red-500/70 bg-orange-500/70  bg-gray-500/70
    return (
        <>
        <Back title={titleProject} />
            <div className="select-none px-8 flex gap-7 overflow-x-scroll ">
                <DragDropContext className="flex gap-7 overflow-x-scroll"
                    onDragEnd={handleDragEnd}>
                    {
                        tables.map(table => (
                            <div key={table} >
                                <h3 className="pt-3 border-t-2 border-r-2 border-l-2 border-t-gray-300 border-r-gray-300 border-l-gray-300 bg-[#5593ff] text-2xl text-[#e8e8e8] font-semibold text-center capitalize" >{table}</h3>

                                <Droppable key={table} droppableId={table}>
                                    {(provided) => (
                                        <ul
                                            className={`pt-4 ${table === 'backlog' ? 'border-r-2 border-l-2 pb-1 border-r-gray-300 border-l-gray-300' : 'border-b-2 border-r-2 border-l-2 border-b-gray-300 border-r-gray-300 border-l-gray-300'} min-w-[260px] ${table === 'backlog' ? 'min-h-[426px]': 'min-h-[500px]'} ${table === 'backlog' ? 'max-h-[426px]': 'max-h-[500px]'} overflow-scroll h-fit bg-[#5593ff]
                                            ${table === 'backlog' ? 'lg:min-h-[526px]': 'lg:min-h-[600px]'} ${table === 'backlog' ? 'lg:max-h-[526px]': 'lg:max-h-[600px]'}`}
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
                                                                    className=" w-fit px-2  text-[13px] font-semibold text-[#dadada]  hover:text-[#ebebeb] transition duration-200" >Edit</button>
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
                                        <div className="pt-4 bg-[#5593ff] min-w-[260px] border-b-2 border-r-2 border-l-2 border-b-gray-300 border-r-gray-300 border-l-gray-300">
                                            <div onClick={() => setIsOpen(true)}
                                                className=" flex justify-center items-center border-[#e5e5e5] bg-[#88b4ff] border-2 mx-3 shadow-lg py-2 mb-4 cursor-pointer hover:bg-[#76a8ff] transition duration-200" >
                                                <img className="size-5 p-0"
                                                    src={plus}></img>
                                            </div>


                                            <DropAddTask trigger={trigger} setTrigger={setTrigger} isOpen={isOpen} setIsOpen={setIsOpen} id={project_id} />
                                        </div>

                                    )
                                    :
                                    null}
                            </div>

                        ))
                    }
                </DragDropContext>
            </div>
            <ModalTask visible={visible} setVisible={setVisible} editable={editable} setEditable={setEditable} project_id={project_id} trigger={trigger} setTrigger={setTrigger}/>
        </>

    )
}


