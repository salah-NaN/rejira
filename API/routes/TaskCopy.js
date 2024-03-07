const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD tasks

module.exports = (router, Model,check) => {
    router.get('/tasks', async (req, res) => await readItems(req, res, Model))
    router.get('/tasks/:id', async (req, res) => await readItem(req, res, Model))
    router.put('/tasks/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/tasks/:id', async (req, res) => await deleteItem(req, res, Model))


    // crear una tarea incluyendo todas las FKs NN requeridas
    // y con el autor el usuario logeado
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
        const {user_id} = req.body
        try {
            const tasks = await Model.findAll({
                where: {user_id}
            })
            if (!tasks) res.status(404).json({ message: 'Not found' })
            res.json(tasks)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // todas las tareas que tiene un proyecto
    router.get('/tasks/projects/:projectId', async (req, res) => {
        const {projectId} = req.params
        try {
            const projects = await Model.findAll({
                where: {
                    ["project_id"]: projectId
                }
            })

            if (!projects) res.status(404).json({ message: 'Not found' })
            res.json(projects)
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


    // aquí es interesante cambiar la fk del user que está realizando la tarea
    router.put('/tasks/:taskId/users/:userId', async (req, res) => {
        const { taskId, userId } = req.params
        const data = req.body
        try {
            const task = await Model.findByPk(taskId)
            if (!task) res.status(404).json({ message: 'Not found' })
            await task.update({
                ...data,
                ["user_id"]: userId
            })
            res.json(task)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


}   
