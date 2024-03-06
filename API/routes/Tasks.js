const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD tasks

module.exports = (router, Model) => {
    router.get('/tasks', async (req, res) => await readItems(req, res, Model))
    router.get('/tasks/:id', async (req, res) => await readItem(req, res, Model))
    router.put('/tasks/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/tasks/:id', async (req, res) => await deleteItem(req, res, Model))


    // crear una tarea incluyendo todas las FKs NN requeridas
    router.post('/tasks/projects/:projectId/authors/:authorId/users/:userId', async (req, res) => {
        const { projectId, authorId, userId } = req.params
        const data = req.body
        try {
            const task = await Model.create({
                ...data,
                ["project_id"]: projectId,
                ["author_id"]: authorId,
                ["user_id"]: userId,
            })
            if (!task) res.status(404).json({ message: 'Not found' })
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


    // todas las tareas que tiene un usuario
    router.get('/tasks/users/:userId', async (req, res) => {
        const {userId} = req.params
        try {
            const users = await Model.findAll({
                where: {
                    ["user_id"]: userId
                }
            })

            if (!users) res.status(404).json({ message: 'Not found' })
            res.json(users)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // todas las tareas que ha inicializado un autor
    router.get('/tasks/authors/:authorId', async (req, res) => {
        const {authorId} = req.params
        try {
            const authors = await Model.findAll({
                where: {
                    ["author_id"]: authorId
                }
            })

            if (!authors) res.status(404).json({ message: 'Not found' })
            res.json(authors)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    //  es innecesario y se tiene que ver cual es la fk interesante a cambiar
    // este es un update de fk de todas las fks
    router.put('/tasks/:taskId/projects/:projectId/authors/:authorId/users/:userId', async (req, res) => {
        const { taskId, projectId, authorId, userId } = req.params
        const data = req.body
        try {
            const project = await Model.findByPk(taskId)
            if (!project) res.status(404).json({ message: 'Not found' })
            await project.update({
                ...data,
                ["project_id"]: projectId,
                ["user_id"]: userId,
                ["author_id"]: authorId
            })
            res.json(project)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


}   
