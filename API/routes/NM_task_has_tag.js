


module.exports = (router, Tasks, Tags, check) => {


    // CRUD simplificado, realmente Create y Read (CR) de NM_task_has_tag


    // asociacion de una tarea a un tag
    router.post('/tasks/:taskId/tags/:tagId', check, async (req, res) => {
        const { taskId, tagId } = req.params
        const {user_id} = req.body
        try {
            const task = await Tasks.findByPk(taskId)
            const tag = await Tags.findByPk(tagId)
            if (!task || !tag) res.status(404).json({ message: 'Not found' })
            if (user_id != task.author_id) return res.status(401).json({ message: 'Unauthorized' })
            // await task.addTags(tag) // the same
            await tag.addTasks(task) // no se que devuelve por ello no hago control de errores
            res.json({ message: 'Linked task to tag' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })


    // pillar todas las tareas para un tag
    router.get('/tasks/tags/:tagId', check, async (req, res) => {
        const { tagId } = req.params
        const {user_id} = req.body
        try {
            const tag = await Tags.findByPk(tagId)
            if (!tag) res.status(404).json({ message: 'Not found' })
            const tasks = await tag.getTasks()
            const send = tasks.every(task => task.author_id === user_id)
            if (!send) return res.status(401).json({ message: 'Unauthorized' })
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
    // pillar todas los tags para una tarea
    router.get('/tags/tasks/:taskId', check, async (req, res) => {
        const { taskId } = req.params
        const {user_id} = req.body
        try {
            const task = await Tasks.findByPk(taskId)
            if (!task) res.status(404).json({ message: 'Not found' })
            if (user_id != task.author_id) return res.status(401).json({ message: 'Unauthorized' })
            const tags = await task.getTags()
            res.json(tags)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
}

    /*
    de NM_task_has_tag tengo:
    - asociacion de una tarea a un tag
    - mostrar todos los tags de una tarea que esté asociada a un usuario
    - mostrar todos las tareas que tengan como autor el propio usuario logueado


    - CRUD super usuario
    */ 
