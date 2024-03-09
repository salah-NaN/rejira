
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
        const { source, destination, draggableId } = result;
        if (!destination) return;
      
        const sourceIndex = source.index;
        const destinationIndex = destination.index;
        const sourceTable = tables[sourceIndex];
        const destinationTable = tables[destinationIndex];
      
        // Si el origen y el destino son las mismas tablas
        if (sourceTable === destinationTable) {
          const newTasks = [...tasks];
          const [removedTask] = newTasks.splice(sourceIndex, 1);
          newTasks.splice(destinationIndex, 0, removedTask);
          setTasks(newTasks);
        } else {
          // Si el origen y el destino son tablas diferentes
          const newTasks = [...tasks];
          const [removedTask] = newTasks.splice(sourceIndex, 1);
          newTasks.splice(destinationIndex, 0, removedTask);
          setTasks(newTasks);
        }
      };
      


    // mostrar el kanban
    // tailwind stuff: bg-red-500 bg-yellow-500  bg-gray-500
    return (
        <>
            <div className="flex gap-7 overflow-x-scroll">
                <DragDropContext className="flex gap-7 overflow-x-scroll"
                onDragEnd={handleDragEnd}>
                    {
                        tables.map(table => (
                            <Droppable key={table} droppableId={table}>
                                {(provided) => (
                                    <ul 
                                    className="border-2 border-black w-[200px] h-[400px]"
                                    {...provided.droppableProps} ref={provided.innerRef}>
                                    <h3>{table}</h3>
                                        {tasks
                                            .filter(task => task.stage === table)
                                            .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.title} index={index}>
                                                {(provided) => (
                                                    <li
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {task.title}
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
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
