const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')

// const verify = async (req, res, next, Tasks) => {
//     const {user_id} = req.body
//     try {
//         if ()
//     } catch (error) {
        
//     }
// }
// CRUD tasks

module.exports = (router, Model, check, Tags, Comments) => {
    router.get('/tasks', check,  async (req, res) => await readItems(req, res, Model))
    router.get('/tasks/:id', check,  async (req, res) => await readItem(req, res, Model))
    router.put('/tasks/:id', check,  async (req, res) => await updateItem(req, res, Model))
    router.delete('/tasks/:id', check,  async (req, res) => await deleteItem(req, res, Model))


    // crear una tarea incluyendo todas las FKs NN requeridas
    // y con el autor el usuario logeado
    // VERSION JODIDA - RESOLVER CON ION - si quiero iniciarla hay que
    // pasar por parametro el modelo User
    // router.post('/tasks/projects/:projectId', check, async (req, res) => {
    //     const { projectId, authorId } = req.params
    //     const { user_id, ...restData } = req.body
    //     try {
    //         const user = await Users.findByPk(user_id)
    //         if (!user) res.status(404).json({ message: 'Not found' })
    //         // como sabes que estas asignando author id en user.createTask
    //         // y no el user id...?
    //         const task = await user.createTask({
    //             ...restData,
    //             project_id: projectId

    //         })

    //         if (!task) res.status(404).json({ message: 'Not found' })
    //         res.json(task)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })



    
    // VERSION MANUAL
    // crear una tarea de un projecto para el usuario logueado
    router.post('/tasks/projects/:projectId',check, async (req, res) => {
        const { projectId, authorId } = req.params
        const {user_id, ...restData} = req.body
        const data = req.body
        try {
            const task = await Model.create({
                ...restData,
                ["project_id"]: projectId,
                ["author_id"]: user_id,
            })
            if (!task) res.status(404).json({ message: 'Not found' })
            res.json(task)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })



    // todas las tareas que tiene un usuario
    // router.get('/tasks/users/:userId', async (req, res) => {
    //     const {userId} = req.params
    //     try {
    //         const users = await Model.findAll({
    //             where: {
    //                 ["user_id"]: userId
    //             }
    //         })

    //         if (!users) res.status(404).json({ message: 'Not found' })
    //         res.json(users)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    // muestro todas las tareas del user logeado
    router.get('/tasksByUser', check, async (req, res) => {
        const { user_id } = req.body
        try {
            const tasks = await Model.findAll({
                where: { author_id: user_id }
            })
            if (!tasks) res.status(404).json({ message: 'Not found' })
            res.json(tasks)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // bien: todas las tareas que tiene un proyecto
    // router.get('/tasks/projects/:projectId',check, async (req, res) => {
    //     const { projectId } = req.params
    //     const {user_id} = req.body
    //     try {
    //         const tasks = await Model.findAll({
    //             where: {
    //                 ["project_id"]: projectId,
    //             }
    //         })
    //         if (!tasks) return res.status(404).json({ message: 'Not found' })
    //         const send = tasks.every(task => task.author_id === user_id)
    //         if (!send) return res.status(401).json({ message: 'Unauthorized' })
    //         res.json(tasks)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    // prueba: todas las tareas que tiene un proyecto 
    router.get('/tasks/projects/:projectId',check, async (req, res) => {
        const { projectId } = req.params
        const {user_id} = req.body
        try {
            const tasks = await Model.findAll({
                where: {
                    ["project_id"]: projectId,
                },
                include: Tags
    
            })
            if (!tasks) return res.status(404).json({ message: 'Not found' })
            // es para revisar si el autor de las tareas es el que está logueado
            // es un fallo de concepto, hay que hacer otro barrido permitiendo subir
            // posts cuyo autor es el que está logueado y pero para leer datos
            // const send = tasks.every(task => task.author_id === user_id)
            // if (!send) return res.status(401).json({ message: 'Unauthorized' })

            res.json(tasks)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })




    //NOTA: no tiene mucho sentido
    // todas las tareas que ha inicializado un autor
    // router.get('/tasks/authors/:authorId', async (req, res) => {
    //     const {authorId} = req.params
    //     try {
    //         const authors = await Model.findAll({
    //             where: {
    //                 ["author_id"]: authorId
    //             }
    //         })

    //         if (!authors) res.status(404).json({ message: 'Not found' })
    //         res.json(authors)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    //  es innecesario y se tiene que ver cual es la fk interesante a cambiar
    // este es un update de fk de todas las fks
    // router.put('/tasks/:taskId/projects/:projectId/authors/:authorId/users/:userId', async (req, res) => {
    //     const { taskId, projectId, authorId, userId } = req.params
    //     const data = req.body
    //     try {
    //         const project = await Model.findByPk(taskId)
    //         if (!project) res.status(404).json({ message: 'Not found' })
    //         await project.update({
    //             ...data,
    //             ["project_id"]: projectId,
    //             ["user_id"]: userId,
    //             ["author_id"]: authorId
    //         })
    //         res.json(project)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })


    //  cambiar la fk del user que está realizando la tarea si soy autor de esa tarea
    router.put('/tasks/:taskId/users/:userId', check, async (req, res) => {
        const { taskId, userId } = req.params
        const {user_id, ...restData} = req.body
        console.log(userId + ' soy el pu... pere')
        try {
            const task = await Model.findByPk(taskId)
            if (!task) return res.status(404).json({ message: 'Not found' })
            if (user_id != task.author_id) return res.status(401).json({ message: 'Unauthorized' })
            await task.update({
                ...restData,
                ["user_id"]: userId
            })
            res.json(task)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })
}   

    /*
    de Tasks tengo:
    - crear una task de un project para el user logueado 
    - muestro todas las tareas del user logeado
    - muestro todas las tareas que tiene un proyecto del user logeado
    - cambio la asignación de una tarea de un usuario a otro


    - CRUD super usuario
    */ 