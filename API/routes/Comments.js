const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD comments

module.exports = (router, Model) => {
    router.get('/comments', async (req, res) => await readItems(req, res, Model))
    router.get('/comments/:id', async (req, res) => await readItem(req, res, Model))
    router.put('/comments/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/comments/:id', async (req, res) => await deleteItem(req, res, Model))


    // crear un comentario que tiene asociado un usuario y una tarea
    router.post('/comments/users/:userId/tasks/:taskId', async (req, res) => {
        const { userId } = req.params
        const { taskId } = req.params
        const data = req.body
        try {
            const item = await Model.create({
                ...data,
                ["user_id"]: userId,
                ["task_id"]: taskId
            })
            res.status(201).json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // que comentarios ha comentado cada usuario 
    router.get('/comments/users/:userId', async (req, res) => {
        const userId = req.params.userId
        try {
            const comments = await Model.findAll({
                where: {
                    ["user_id"]: userId
                }
            })

            if(!comments) res.status(404).json({message: 'Not found'})
            res.json(comments)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // que comentarios hay en una tarea específica
    router.get('/comments/tasks/:taskId', async (req, res) => {
        const taskId = req.params.taskId
        try {
            const comments = await Model.findAll({
                where: {
                    ["task_id"]: taskId
                }
            })

            if(!comments) res.status(404).json({message: 'Not found'})
            res.json(comments)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // para modificar las fks de los comentarios, para simplificar haré
    // que se modifiquen los 2 a la vez, en lugar de crear 3 funciones
    router.put('/comments/:commentId/users/:userId/tasks/:taskId', async (req, res) => {
        const { userId } = req.params
        const { commentId } = req.params
        const { taskId } = req.params
        const data = req.body
        try {
            const comment = await Model.findByPk(commentId)
            if (!comment) res.status(404).json({ message: 'Not found' })
            await comment.update({
                ...data,
                ["user_id"]: userId,
                ["task_id"]: taskId
            })
            res.json(comment)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

}   