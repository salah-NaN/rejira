import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const URL = 'http://localhost:3000/api'


export default function Home() {
    const [projects, setProjects] = useState([])


    // constants
    const redirect = useNavigate()

    // useEffects
    useEffect(() => {

        setTimeout(() => {

            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
            fetch(URL + '/projectsByUser', options)
                .then(res => res.json())
                .then(res => setProjects(res))
                .catch(err => console.log(err))
        }, 300);
    }, [])

    // funcs
    const handleProject = (id) => {
        redirect(`/projects/${id}`)
    }

    return (
        <>
            <div>
                {
                    // bg-green-500 bg-red-500
                    projects && projects.map(project => {
                        return (
                            <div className="w-4/5 h-48 mx-auto my-7 bg-orange-500"
                                key={project.id}
                                onClick={() => handleProject(project.id)}>
                                <h1>{project.title}</h1>
                                <p>{project.description}</p>
                                <div className={`size-10 bg-${project.active ? 'green' : 'red'}-500 rounded-full`} ></div>
                            </div>

                        )
                    })
                }
            </div>
        </>
    )
}