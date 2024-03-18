const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')
const bcrypt = require('bcrypt')






module.exports = (router, Model, check, jwt, secretKey) => {




    // esto se tiene que manejar a un nivel mas top 
    // ya que este crud a priori es de super usuario
    // y no te maneja el que no puedas hacer ninguna
    //operacion hasta que el usuario no esté logueado

    // CRUD USERS
    router.get('/users', async (req, res) => await readItems(req, res, Model))
    router.get('/users/:id', async (req, res) => await readItem(req, res, Model))
    router.put('/users/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/users/:id', async (req, res) => await deleteItem(req, res, Model))



    // Al tener un register, he de hacer un beforeCreate para encriptar la 
    // contraseña
    Model.beforeCreate(async (user) => {
        const codedPassword = await bcrypt.hash(user.password, 10)
        user.password = codedPassword
    })
    // register
    router.post('/register', async (req, res) => {
        try {
            const data = req.body
            if (!req.body.name || !req.body.email || !req.body.password) {
                return res.status(400).json({ message: 'All inputs required' })
            }
            const possibleUser = await Model.findOne({ where: { email: req.body.email } })
            if (possibleUser) return res.status(400).json({ message: 'User registred' })
            const item = await Model.create(data)
            if (!item) return res.status(404).json({ message: 'Not found' })
            res.status(201).json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    //login
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Model.findOne({ where: { email } })
            if (!user) return res.status(404).json({ error: 'Not found' })
            const verifyPassword = await bcrypt.compare(password, user.password)
            // error contraseña inválida
            if (!verifyPassword) return res.status(401).json({ error: 'Invalid password' })
            const token = jwt.sign({ user_id: user.id, user_name: user.name }, secretKey, { expiresIn: '2h' })
            res.cookie('token', token, { httpOnly: false, maxAge: 7200000 })
            res.json({ user_id: user.id, name: user.name })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

    // refresh to check user is valid
    router.get('/refresh', check, async (req, res) => {
        try {
            const { user_id } = req.body
            const user = await Model.findByPk(user_id)
            if (!user) return res.status(404).json({ message: 'Not found' })
            res.json({ user_id: user.id, name: user.name })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })



    /*
    de Users tengo:
    - crear un usuario 
    - validar datos y abrir una sesion


    - CRUD super usuario
    */

}