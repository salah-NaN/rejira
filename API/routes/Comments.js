const { where } = require('sequelize')
const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD comments

module.exports = (router, Model, check, Tasks) => {
    router.get('/comments', check, async (req, res) => await readItems(req, res, Model))
    router.get('/comments/:id', check, async (req, res) => await readItem(req, res, Model))
    router.put('/comments/:id', check, async (req, res) => await updateItem(req, res, Model))
    router.delete('/comments/:id', check, async (req, res) => await deleteItem(req, res, Model))


    // crear un comentario que tiene asociado un usuario y una tarea
    router.post('/comments/tasks/:task_id/projects/:project_id', check, async (req, res) => {
        const { task_id, project_id } = req.params
        const { user_id, ...restData } = req.body
        try {
            const task = await Tasks.findByPk(task_id, { where: { project_id } })
            if (!task) return res.status(404).json({ message: 'Not found' })
            const item = await Model.create({
                ...restData,
                user_id,
                task_id
            })
            if (!item) return res.status(404).json({ message: 'Not found' })
            res.status(201).json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // PENDIENTE - que comentarios ha comentado el user logueado 
    router.get('/commentsByUser', check, async (req, res) => {
        const { user_id } = req.body
        try {
            const comments = await Model.findAll({
                where: {
                    user_id
                }
            })
            if (!comments) res.status(404).json({ message: 'Not found' })
            res.json(comments)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // que comentarios hay en una tarea específica cuyo user es el logueado
    router.get('/comments/tasks/:taskId', check, async (req, res) => {
        const taskId = req.params.taskId
        const { user_id } = req.body
        try {
            const comments = await Model.findAll({
                where: {
                    ["task_id"]: taskId
                }
            })
            if (!comments) res.status(404).json({ message: 'Not found' })

            const send = comments.every(comment => comment.user_id === user_id)
            if (!send) return res.status(401).json({ message: 'Unauthorized' })
            res.json(comments)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // para modificar las fks de los comentarios, para simplificar haré
    // que se modifiquen los 2 a la vez, en lugar de crear 3 funciones
    // router.put('/comments/:commentId/users/:userId/tasks/:taskId', async (req, res) => {
    //     const { userId } = req.params
    //     const { commentId } = req.params
    //     const { taskId } = req.params
    //     const data = req.body
    //     try {
    //         const comment = await Model.findByPk(commentId)
    //         if (!comment) res.status(404).json({ message: 'Not found' })
    //         await comment.update({
    //             ...data,
    //             ["user_id"]: userId,
    //             ["task_id"]: taskId
    //         })
    //         res.json(comment)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

}

/*
    de Comments tengo:
    - crear un comment a partir del user logueado y de la tarea asociada
    - mostrar todos los comentarios de un user logueado PENDIENTE: 
        ya que tiene que ver con el network de la app
    - mostrar todos los comentarios de una tarea cuyo user es el que está logueado


    - CRUD super usuario
    */ 