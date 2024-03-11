
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ModalTask from "../components/ModalTask"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
const URL = 'http://localhost:3000/api'


export default function SingleProject() {
    const [tasks, setTasks] = useState([])


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


    // mostrar el kanban
    // tailwind stuff: bg-red-500 bg-yellow-500  bg-gray-500
    return (
        <>
            <div className="px-5 flex gap-7 overflow-x-scroll h-lvh">
                <DragDropContext className="flex gap-7 overflow-x-scroll"
                    onDragEnd={handleDragEnd}>
                    {
                        tables.map(table => (
                            <div key={table} >
                                <h3 className="pt-3 border-t-2 border-r-2 border-l-2 border-t-gray-300 border-r-gray-300 border-l-gray-300 bg-[#5593ff] text-2xl text-[#efefef] font-semibold text-center" >{table}</h3>

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
                                                            <li className="border-[#e5e5e5] bg-[#88b4ff] border-2 py-3 mb-4 mx-3"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <p className="ml-2 ">{task.title}</p>
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




{/* <div className="flex gap-7 overflow-x-scroll">
                {
                    tables.map(table => {
                        return (
                            <div key={table} className="h-[400px] min-w-52 bg-red-400">
                                <h3 className="mb-10">{table}</h3>
                                {
                                    tasks
                                        .filter(task => task.stage === table)
                                        .map(task => {
                                            return (
                                                <div key={task.id}
                                                className="w-full mb-6  bg-sky-400  ">
                                                    <div className="flex justify-between">
                                                    <h4 className="text-xl" >{task.title}</h4>
                                                    <div className={`size-10 bg-${task.priority === 'high' ? 'red' : (task.priority === 'medium' ? 'yellow' : 'gray')}-500 rounded-full`} ></div>
                                                    </div>
                                                    <p className="text-sm font-light">{task.type}</p>

                                                </div>
                                            )
                                        })
                                }
                            </div>
                        )
                    })
                }

            </div>

            <ModalTask/> */}












// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// const initialData = {
//   meals: [
//     { id: '1', content: 'Pizza' },
//     { id: '2', content: 'Manzana' },
//     { id: '3', content: 'Croissant' },
//     { id: '4', content: 'Pollo' }
//   ],
//   boards: [
//     { id: 'plates', title: 'Platos', items: [] },
//     { id: 'fruits', title: 'Frutas', items: [] },
//     { id: 'pastries', title: 'Bollería', items: [] },
//     { id: 'proteins', title: 'Proteínas', items: [] }
//   ]
// };

// const SingleProject = () => {
//   const [data, setData] = useState(initialData);

//   const onDragEnd = (result) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;

//     const sourceBoard = data.boards.find(board => board.id === source.droppableId);
//     const destinationBoard = data.boards.find(board => board.id === destination.droppableId);
//     const item = sourceBoard.items.find(item => item.id === draggableId);

//     if (source.droppableId === destination.droppableId) {
//       sourceBoard.items.splice(source.index, 1);
//       destinationBoard.items.splice(destination.index, 0, item);
//     } else {
//       sourceBoard.items.splice(source.index, 1);
//       destinationBoard.items.splice(destination.index, 0, item);
//     }

//     setData({ ...data });
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className="flex">
//         {data.boards.map(board => (
//           <div key={board.id} className="p-4">
//             <h2>{board.title}</h2>
//             <Droppable droppableId={board.id}>
//               {(provided) => (
//                 <ul {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-200 p-4 rounded">
//                   {board.items.map((item, index) => (
//                     <Draggable key={item.id} draggableId={item.id} index={index}>
//                       {(provided) => (
//                         <li
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="bg-white p-2 m-2 rounded"
//                         >
//                           {item.content}
//                         </li>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </ul>
//               )}
//             </Droppable>
//           </div>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// };

// export default SingleProject;








// import { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import ModalTask from "../components/ModalTask"
// import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
// const URL = 'http://localhost:3000/api'


// export default function SingleProject() {
//     // const Tasks = ['arreglar bug', 'crear endpoint', 'cambiar boton']
//     const Tasks = [
//         { id: 1, title: 'arreglar bug', stage: 'backlog' },
//         { id: 2, title: 'crear endpoint', stage: 'ready' },
//         { id: 3, title: 'cambiar boton', stage: 'in progress' },
//         { id: 4, title: 'boton', stage: 'in progress' },
//         { id: 5, title: 'ser un boton', stage: 'in progress' },
//         { id: 6, title: 'pulsar un boton', stage: 'in progress' },
//         { id: 7, title: 'eliminar boton', stage: 'in progress' },
//         // Otras tareas...
//     ];

//     const [tasks, setTasks] = useState(Tasks)


//     // constants 
//     const { id: project_id } = useParams()
//     const tables = ['backlog', 'ready', 'in progress', 'review', 'testing', 'done']


//     // useEffects

//     // solicitar todas las tareas de ese proyecto
//     useEffect(() => {


//         // solicitar todas las tareas
//         const options = {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             credentials: 'include'
//         }
//         fetch(URL + `/tasks/projects/${project_id}`, options)
//             .then(res => res.json())
//             .then(res => console.log(res))
//             .catch(err => console.log(err))
//     }, [])



//     // funcs 
//     const handleDragEnd = (result) => {
//         console.log(result)
//         if(!result.destination) return;
//         const {source, destination, draggableId} = result

//         // tasks clone
//         const clone = [...tasks]

//         if(source.droppableId === destination.droppableId){
//             const allowed = clone.filter(task => task.stage == destination.droppableId)
//             const notAllowed = clone.filter(task => task.stage != destination.droppableId)
//             const [draggedTask] = allowed.splice(source.index, 1)
//             allowed.splice(destination.index, 0, draggedTask)
//             setTasks([...notAllowed, ...allowed])
//         } else {
//             const origin = clone.filter(task => task.stage == source.droppableId)
//             const dest = clone.filter(task => task.stage === destination.droppableId)
//             const rest = clone.filter(task => (task.stage != destination.droppableId) && (task.stage != source.droppableId))
//             const [draggableTask] = origin.splice(source.index, 1) 
//             draggableTask.stage = destination.droppableId
//             dest.push(draggableTask)
//             setTasks([...rest, ...origin, ...dest])

//         }

























//         // const { source, destination, draggableId } = result;
//         // if (!destination) return;

//         // const sourceIndex = source.index;
//         // const destinationIndex = destination.index;
//         // const sourceTable = tables[sourceIndex];
//         // const destinationTable = tables[destinationIndex];


//         // if (sourceTable === destinationTable) {
//         //     const newTasks = [...tasks];
//         //     const [removedTask] = newTasks.splice(sourceIndex, 1);
//         //     newTasks.splice(destinationIndex, 0, removedTask);
//         //     setTasks(newTasks);
//         // } else {
//         //     const newTasks = [...tasks];
//         //     const [removedTask] = newTasks.splice(sourceIndex, 1);
//         //     removedTask.stage = destination.droppableId
//         //     newTasks.splice(destinationIndex, 0, removedTask);
//         //     console.log(removedTask)
//         //     setTasks(newTasks);
//         // }
//     };



//     // mostrar el kanban
//     // tailwind stuff: bg-red-500 bg-yellow-500  bg-gray-500
//     return (
//         <>
//             <div className="flex gap-7 overflow-x-scroll">
//                 <DragDropContext className="flex gap-7 overflow-x-scroll"
//                     onDragEnd={handleDragEnd}>
//                     {
//                         tables.map(table => (
//                             <Droppable key={table} droppableId={table}>
//                                 {(provided) => (
//                                     <ul
//                                         className="border-2 border-black w-[200px] h-[400px] px-7"
//                                         {...provided.droppableProps} ref={provided.innerRef}>
//                                         <h3>{table}</h3>
//                                         {tasks
//                                             .filter(task => task.stage === table)
//                                             .map((task, index) => (
//                                                 <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
//                                                     {(provided) => (
//                                                         <li className="w-full border border-slate-900 px-5 mb-3"
//                                                             ref={provided.innerRef}
//                                                             {...provided.draggableProps}
//                                                             {...provided.dragHandleProps}
//                                                         >
//                                                             {task.title}
//                                                         </li>
//                                                     )}
//                                                 </Draggable>
//                                             ))}
//                                         {provided.placeholder}
//                                     </ul>
//                                 )}
//                             </Droppable>
//                         ))
//                     }
//                 </DragDropContext>
//             </div>
//         </>

//     )
// }

