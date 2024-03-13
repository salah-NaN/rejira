
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ModalTask from "../components/ModalTask"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
const URL = 'http://localhost:3000/api'


export default function SingleProject() {
    const [tasks, setTasks] = useState([])
    const [parsedtasks, setParsedTasks] = useState([])


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
            .then(res => setTasks(res))
            .catch(err => console.log(err))
    }, [])

    // guardar en el localstorage todos los cambios de posición de las tareas
    useEffect(() => {
        console.log(tasks)
        const beforeSave = tasks.map((task, index) => {
            return { ...task, order: index }
        })
        localStorage.setItem('tasks', JSON.stringify(beforeSave))


        // console.log(updatedTasks[1])
        // console.log(updatedTasks[2])
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

    // para guardar el orden de las tareas via fetch
    const saveBeforeClose = async () => {
        const updatedTasks = localStorage.getItem('tasks')
        const tasksFromStorage = JSON.parse(updatedTasks)

        const parsed = tasksFromStorage.map(task => {
            const {id,  order} = task
            return {id, order}
        })
        console.log('test')

        // if (parsed) {
        //     const options = {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         credentials: 'include'
        //     }
        //     fetch(URL + '/projects/' + id, options)
        //         .then(res => res.json())
        //         .then(res => setEditable(res))
        //         .catch(err => console.log(err))
        // }


    }

    // execution zone
    window.addEventListener('beforeunload', () => {
        saveBeforeClose()
    })

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
                                            className="pt-4 border-b-2 border-r-2 border-l-2 bg-[#5593ff] border-b-gray-300 border-r-gray-300 border-l-gray-300 min-w-[260px] h-fit"
                                            {...provided.droppableProps} ref={provided.innerRef}>
                                            {tasks
                                                .filter(task => task.stage === table)
                                                .map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <li className="border-[#e5e5e5] bg-[#88b4ff] border-2 py-3 mb-4 mx-3 shadow-lg"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <div className="mx-2 flex justify-between font-medium text-[#f8f8f8]">
                                                                    <h4 className="">{task.title}</h4>
                                                                    <div className={`size-5 ml-3 bg-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'gray'}-500/70 rounded-full shrink-0 shadow-sm`}></div>
                                                                </div>
                                                                <p className="ml-2 text-[13px] text-gray-100">{task.Assigned.name}</p>
                                                                {/* {task.tags} */}
                                                                <p className="truncate">
                                                                    {task.tags.map(tag => <div className="inline-block w-fit ml-2 mt-1 px-2 rounded-full bg-[#e5e5e5] shadow">{'#' + tag.name_tag}</div>)}
                                                                </p>
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            {provided.placeholder}
                                        </ul>
                                    )}
                                </Droppable>
                            </div>

                        ))
                    }
                </DragDropContext>
            </div>
        </>

    )
}


