import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import plus from '../assets/add.png';
import ModalCreateProject from "../components/ModalCreateProject";
import ModalEditProject from "../components/ModalEditProject";
import Context from "../util/Context";


const URL = 'http://localhost:3000/api'

export default function Home() {
    const [projects, setProjects] = useState([])
    const [projectData, setProjectData] = useState({})
    // modal toggle
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)

    const [newProject, setNewProject] = useState({title: '', description: '', active: 0})
    const [editable, setEditable] = useState({title: '', description: '', active: 0})



    // constants
    const redirect = useNavigate()
    const {logged} = useContext(Context)

    // useEffects
    useEffect(() => {

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
            fetch(URL + '/projectsByUser', options)
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    setProjects(res)
                })
                .catch(err => console.log(err))
    }, [])



    // funcs
    const handleProject = (id) => {
        redirect(`/projects/${id}`)
    }

    const handleEdit = (event, id) => {
        // for not errors of div click and button click
        event.stopPropagation()

        // show modal
        setVisible2(true)

        // fetch to get project info
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        fetch(URL + '/projects/' + id, options)
            .then(res => res.json())
            .then(res => setEditable(res))
            .catch(err => console.log(err))

    }

    return (
        <>
            <div className="grid grid-cols-1 gap-y-8 w-4/5 mx-auto mt-14
            md:grid-cols-2 md:gap-10
            lg:grid-cols-3 lg:gap-8
            xl:grid-cols-4 xl:gap-12">
                {
                    // bg-green-500/80 bg-red-500/80
                    projects && projects.map(project => {
                        return (
                            <div className=" relative h-56 px-7 py-4 shadow-lg
                              bg-[#3b82f6]/80 "
                                key={project.id}
                                onClick={() => handleProject(project.id)}>
                                <div className="flex justify-between items-center mb-4" >
                                    <h3 className="text-2xl font-semibold truncate text-[#f9f9f9]" >{project.title}</h3>
                                    <div className={`size-5 ml-3 bg-${project.active ? 'green' : 'red'}-500/80 rounded-full shrink-0 text-pretty`} ></div>
                                </div>
                                <p className="text-[13px] text-pretty text-[#dadada] truncate line-clamp-4 " >{project.description}</p>
                                <button onClick={(event) => handleEdit(event, project.id)}
                                className="absolute bottom-5 left-7 w-fit px-2 py-1 text-[13px] font-semibold border-2 border-[#dadada] text-[#dadada] hover:border-[#ebebeb] hover:text-[#ebebeb] transition duration-200" >Edit</button>
                            </div>

                        )
                    })
                }
                {/* add image */}
                <div onClick={(handleProject) => setVisible(true)}
                className="mb-20 flex justify-center items-center h-52 px-9 py-5 shadow-lg  bg-gradient-to-br from-[#d3dbe8] to-[#e0e7f3] cursor-pointer">
                    <img className="size-16 " src={plus} ></img>
                </div>

            </div>
            {/* modal to create */}
            <ModalCreateProject visible={visible} setVisible={setVisible} newProject={newProject} setNewProject={setNewProject} projects={projects} setProjects={setProjects} />

            {/* modal to edit */}
            <ModalEditProject visible={visible2} setVisible={setVisible2} editable={editable} setEditable={setEditable} projects={projects} setProjects={setProjects}/>
        </>
    )
}