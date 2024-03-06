


module.exports = (router, Tasks, Tags) => {

    // CRUD simplificado, realmente Create y Read (CR) de NM_task_has_tag
    router.post('/tasks/:taskId/tags/:tagId', async (req, res) => {
        const { taskId, tagId } = req.params
        try {
            const task = await Tasks.findByPk(taskId)
            const tag = await Tags.findByPk(tagId)
            if (!task || !tag) res.status(404).json({ message: 'Not found' })
            // await task.addTags(tag)
            await tag.addTasks(task)
            res.json({ message: 'Linked task to tag' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })


    // pillar todas las tareas para un tag
    router.get('/tasks/tags/:tagId', async (req, res) => {
        const { tagId } = req.params
        try {
            const tag = await Tags.findByPk(tagId)
            if (!tag) res.status(404).json({ message: 'Not found' })
            const tasks = await tag.getTasks()
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
    // pillar todas los tags para una tarea
    router.get('/tags/tasks/:taskId', async (req, res) => {
        const { taskId } = req.params
        try {
            const task = await Tasks.findByPk(taskId)
            if (!task) res.status(404).json({ message: 'Not found' })
            const tags = await task.getTags()
            res.json(tags)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
}
