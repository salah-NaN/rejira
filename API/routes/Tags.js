const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD TAGS

module.exports = (router, Model) => {
    router.get('/tags', async (req, res) => await readItems(req, res, Model))
    router.get('/tags/:id', async (req, res) => await readItem(req, res, Model))
    router.post('/tags', async (req, res) => await createItem(req, res, Model))
    router.put('/tags/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/tags/:id', async (req, res) => await deleteItem(req, res, Model))
}   