const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD projects

module.exports = (router, Model) => {
    router.get('/projects', async (req, res) => await readItems(req, res, Model))
    router.get('/projects/:id', async (req, res) => await readItem(req, res, Model))
    router.post('/projects', async (req, res) => await createItem(req, res, Model))
    router.put('/projects/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/projects/:id', async (req, res) => await deleteItem(req, res, Model))


    // crear un proyecto asociado a un user
    router.post('/projects/users/:userId', async (req, res) => {
        const userId = req.params.userId
        const data = req.body
        try {
            const project = await Model.create({
                ...data,
                ["user_id"]: userId
            })

            if (!project) res.status(404).json({ message: 'Not found' })
            res.status(201).json(project)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // todos los proyectos que ha creado un usuario
    router.get('/projects/users/:userId', async (req, res) => {
        const userId = req.params.userId
        try {
            const projects = await Model.findAll({
                where: {
                    ["user_id"]: userId
                }
            })

            if (!projects) res.status(404).json({ message: 'Not found' })
            res.json(projects)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    //  para modificar la fk
    router.put('/projects/:projectId/users/:userId', async (req, res) => {
        const { userId } = req.params
        const { projectId } = req.params
        const data = req.body
        try {
            const project = await Model.findByPk(projectId)
            if (!project) res.status(404).json({ message: 'Not found' })
            await project.update({
                ...data,
                ["user_id"]: userId
            })
            
            res.json(project)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    //IMPORTANTE - PAUTAS
    // hacer un post con todas las fk NN requeridas
    // si quiero pillar a partir de una fk todos las rows de otra tabla
    // si quiero cambiar la fk de un proyecto

    // en total son 2 puts, no se podría simplificar a 1 (creo)

}   