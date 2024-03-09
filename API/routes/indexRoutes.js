// en Users.js:14 hay informacion relevante

// imports
const express = require('express')
const {Users, Projects, Tags, Tasks, Comments} = require('../models')
const jwt = require('jsonwebtoken')
// aqui se deben importar las rutas de cada uno 
// de los endpoints separados
const usersController = require('./Users')
const tagsController = require('./Tags')
const projectsController = require('./Projects')
const commentsController = require('./Comments')
const tasksController = require('./Tasks')
const NM_task_has_tagController = require('./NM_task_has_tag')


// constants 
const router = express.Router()
const secretKey = 'esto_es_muy_creativo'

// enpoints de register y login

// register: Users.js:23

// login: Users.js:45

const check = async (req, res, next) => {
    const token = req.cookies?.token
    if(!token) res.status(401).json({message: 'Unauthorized'})
    try {
       const decodedToken = jwt.verify(token, secretKey)

       // si token va perfe
       req.body.user_id = decodedToken.user_id
       next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// all endpoints for each model execution
usersController(router, Users,check, jwt, secretKey)
tagsController(router, Tags,check)
projectsController(router, Projects,check)
commentsController(router, Comments,check)
tasksController(router, Tasks, check, Tags, Comments)
NM_task_has_tagController(router, Tasks, Tags,check)







module.exports = router




// // tests
// const test = async () => {
    
//     const tag = await Tags.findAll({
//         raw: true       
//     })
//     console.log(tag)
// }

// test()