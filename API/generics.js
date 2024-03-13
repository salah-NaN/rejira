

const readItems = async (req, res, Model) => {
    try {
        const items = await Model.findAll();
        if (!items) res.status(404).json({ message: 'Not found' })
        res.json(items)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const readItem = async (req, res, Model) => {
    const id = req.params.id
    try {
        const item = await Model.findByPk(id)
        if (!item) res.status(404).json({ error: 'Not found' })
        res.json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateItem = async (req, res, Model) => {
    const id = req.params.id
    const data = req.body
    try {
        const item = await Model.findByPk(id)
        if (!item) res.status(404).json({ message: 'Not found' })
        await item.update(data)
        res.json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const deleteItem = async (req, res, Model) => {
    const id = req.params.id
    try {
        const item = await Model.findByPk(id)
        if (!item) return res.status(404).json({ message: 'Not found' })
        await item.destroy()
        res.json({ message: 'Item deleted' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


const createItem = async (req, res, Model) => {
    const data = req.body
    try {
        const item = await Model.create(data)
        if (!item) res.status(404).json({ message: 'Not found' })
        res.status(201).json(item)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = { readItems, readItem, createItem, updateItem, deleteItem }