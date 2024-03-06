const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD USERS

module.exports = (router, Model) => {
    router.get('/users', async (req, res) => await readItems(req, res, Model))
    router.get('/users/:id', async (req, res) => await readItem(req, res, Model))
    router.post('/users', async (req, res) => await createItem(req, res, Model))
    router.put('/users/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/users/:id', async (req, res) => await deleteItem(req, res, Model))
}   