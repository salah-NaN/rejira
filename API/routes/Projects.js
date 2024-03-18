const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')



// CRUD projects

module.exports = (router, Model, check) => {
    router.get('/projects', check, async (req, res) => await readItems(req, res, Model))
    router.post('/projects', check, async (req, res) => await createItem(req, res, Model))


    // todos los proyectos que ha creado un usuario
    router.get('/projectsByUser', check, async (req, res) => {
        const { user_id } = req.body

        console.log('ENDPOINT PROYECTO RECIBE DATOS: user: ', user_id)

        try {
            const projects = await Model.findAll({
                where: {
                    user_id
                }
            })
            console.log('PROJECTES ENVIATS: ' + projects.length)
            if (!projects) return res.status(404).json({ message: 'Not found' })
            res.json(projects)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // gettear un proyecto asociado a un user
    router.get('/projects/:id', check, async (req, res) => {
        const { user_id } = req.body

        const id = req.params.id

        try {
            const item = await Model.findByPk(id)
            if (!item) return res.status(404).json({ message: 'Not found' })
            if (item.user_id != user_id) return res.status(401).json({ message: 'Unauthorized' })
            res.json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // crear un proyecto asociado a un user
    router.post('/projectsByUser', check, async (req, res) => {
        const { user_id, ...restData } = req.body

        try {
            const project = await Model.create({
                ...restData,
                user_id
            })
            if (!project) return res.status(404).json({ message: 'Not found' })
            res.status(201).json(project)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // endpoint para actualizar un proyecto 
    router.put('/projects/:id', check, async (req, res) => {
        const id = req.params.id
        const { user_id, ...restData } = req.body
        try {
            const item = await Model.findByPk(id)
            if (!item) return res.status(404).json({ message: 'Not found' })
            if (item.user_id != user_id) return res.status(401).json({ message: 'Unauthorized' })
            await item.update(restData)
            res.json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // endpoint para eliminar un projecto
    router.delete('/projects/:id', check, async (req, res) => {
        const { user_id } = req.body

        const id = req.params.id
        try {
            const item = await Model.findByPk(id)
            if (!item) return res.status(404).json({ message: 'Not found' })
            if (item.user_id != user_id) return res.status(401).json({ message: 'Unauthorized' })
            await item.destroy()
            res.json({ message: 'Item deleted' })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })






    //  para modificar la fk
    // router.put('/projects/:projectId/users/:userId', async (req, res) => {
    //     const { userId } = req.params
    //     const { projectId } = req.params
    //     const data = req.body
    //     try {
    //         const project = await Model.findByPk(projectId)
    //         if (!project) res.status(404).json({ message: 'Not found' })
    //         await project.update({
    //             ...data,
    //             ["user_id"]: userId
    //         })

    //         res.json(project)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })


    //IMPORTANTE - PAUTAS
    // hacer un post con todas las fk NN requeridas
    // si quiero pillar a partir de una fk todos las rows de otra tabla
    // si quiero cambiar la fk de un proyecto

    // en total son 2 puts, no se podría simplificar a 1 (creo)


    /*
    de Projects tengo:
    - crear un proyecto a partir del user logueado
    - mostrar todos los proyectos de un user logueado


    - CRUD super usuario
    */
}   