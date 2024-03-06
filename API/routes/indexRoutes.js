// en ./projects hay informacion relevante

// imports
const express = require('express')
const {Users, Projects, Tags, Tasks, Comments} = require('../models')
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

// all endpoints for each model execution
usersController(router, Users)
tagsController(router, Tags)
projectsController(router, Projects)
commentsController(router, Comments)
tasksController(router, Tasks)
NM_task_has_tagController(router, Tasks, Tags)















module.exports = router




// // tests
// const test = async () => {
    
//     const tag = await Tags.findAll({
//         raw: true       
//     })
//     console.log(tag)
// }

// test()