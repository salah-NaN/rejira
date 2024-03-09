const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')


// CRUD TAGS

module.exports = (router, Model, check) => {
    router.get('/tags',check , async (req, res) => await readItems(req, res, Model))
    router.get('/tags/:id',check , async (req, res) => await readItem(req, res, Model))
    router.post('/tags',check , async (req, res) => await createItem(req, res, Model))
    router.put('/tags/:id',check , async (req, res) => await updateItem(req, res, Model))
    router.delete('/tags/:id',check , async (req, res) => await deleteItem(req, res, Model))
}   

/*
    de Users tengo:

    - CRUD super usuario
    sin tener en cuenta que cada tag está asciado a una tarea
    que a su vez tiene un usuario que es el que tiene que estar 
    logueado
    */ 