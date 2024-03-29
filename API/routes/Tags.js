const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')
const { Tags } = require('../models')



// CRUD TAGS

module.exports = (router, Model, check, Tasks) => {
    router.get('/tags', check, async (req, res) => await readItems(req, res, Model))
    router.get('/tags/:id', check, async (req, res) => await readItem(req, res, Model))
    router.post('/tags', check, async (req, res) => await createItem(req, res, Model))
    router.put('/tags/:id', check, async (req, res) => await updateItem(req, res, Model))



    // no lo he hecho como una transacción por lo cual si falla una parte intermedia
    // pueden haber futuros errores
    router.post('/tags/projects/:project_id/tasks/:task_id', check, async (req, res) => {
        const data = req.body

        const { task_id, project_id } = req.params
        try {
            const item = await Tasks.findByPk(task_id, { where: { project_id } })
            if (!item) return res.status(404).json({ message: 'Not found' })
            // if tag is empty
            if (!data.name_tag) return res.status(404).json({ message: 'Empty item' })

            // a tag exists on this task
            // const tagExists = await Model.findOne({ where: {name_tag: data.name_tag } })
            // if (tagExists) return res.status(404).json({ message: 'Already exists' })

            const tags = await item.getTags()

            const gotIT = tags.filter(tag => tag.name_tag === data.name_tag)
            if(gotIT.length) return res.status(400).json({message: 'Already exists'})

            const tag = await Model.create(data)
            if (!tag) return res.status(400).json({ message: 'Not created' })
            await tag.addTasks(item)
            res.json(tag)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // endpoint para borrar un tag asociado a una tarea y esta asociada a un proyecto
    router.delete('/tags/:tag_id/projects/:project_id/tasks/:task_id', check, async (req, res) => {
        const { tag_id, task_id, project_id } = req.params
        console.log(req.params)
        try {
            const item = await Tasks.findByPk(task_id, { where: { project_id } })
            if (!item) return res.status(404).json({ message: 'Not found' })
            const tag = await Model.findByPk(tag_id)

            if (!tag) return res.status(404).json({ message: 'Not found' })
            await tag.removeTasks(item)
            await tag.destroy()

            res.json({ message: 'Item deleted' })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })
}

/*
    de Users tengo:

    - CRUD super usuario
    sin tener en cuenta que cada tag está asciado a una tarea
    que a su vez tiene un usuario que es el que tiene que estar 
    logueado
    */ 