const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')
const bcrypt = require('bcrypt')






module.exports = (router, Model, secretKey, jwt, check) => {





    // CRUD USERS
    router.get('/users', async (req, res) => await readItems(req, res, Model))
    router.get('/users/:id', async (req, res) => await readItem(req, res, Model))
    router.put('/users/:id', async (req, res) => await updateItem(req, res, Model))
    router.delete('/users/:id', async (req, res) => await deleteItem(req, res, Model))



    // Al tener un register, he de hacer un beforeCreate para encriptar la 
    // contraseña
    Model.beforeCreate(async (user) => {
        const hash = await bcrypt.hash(user.password, 10)
        user.password = hash
    })
    // register
    router.post('/register', async (req, res) => {
        try {
            const data = req.body
            if (!req.body.name || !req.body.email || !req.body.password) {
                res.status(400).json({ message: 'All inputs required' })
            }
            const possibleUser = await Model.findOne({ where: { email: req.body.email } })
            if (possibleUser) res.status(400).json({ message: 'User registred' })
            const item = await Model.create(data)
            res.status(201).json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    //login
    router.post('/login', async (req, res) => {
        try {
            const data = req.body
            const { name, email, password } = req.body
            const user = await Model.findOne({ where: { email } })
            if (!user) res.status(404).json({ message: 'Not found' })
            const verifyPassword = bcrypt.compare(password, user.password)
            // error contraseña inválida
            if (!verifyPassword) res.status(400).json({ message: 'Invalid password' })
            const token = jwt.sign({user_id: user.id, user_name: user.name}, secretKey, {expiresIn: '2h'})
            res.cookie('token', token)
            res.json({message: 'Correct login'})
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
}