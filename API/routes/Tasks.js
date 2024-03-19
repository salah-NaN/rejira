const { QueryTypes } = require('sequelize')
const { readItems, readItem, createItem, updateItem, deleteItem } = require('../generics')

// const verify = async (req, res, next, Tasks) => {
//     const {user_id} = req.body
//     try {
//         if ()
//     } catch (error) {

//     }
// }
// CRUD tasks

module.exports = (router, Model, check, Tags, Comments, Users, sequelize) => {
    router.get('/tasks', check, async (req, res) => await readItems(req, res, Model))
    // router.put('/tasks/:id', check, async (req, res) => await updateItem(req, res, Model))



    // crear una tarea incluyendo todas las FKs NN requeridas
    // y con el autor el usuario logeado
    // VERSION JODIDA - RESOLVER CON ION - si quiero iniciarla hay que
    // pasar por parametro el modelo User
    // router.post('/tasks/projects/:projectId', check, async (req, res) => {
    //     const { projectId, authorId } = req.params
    //     const { user_id, ...restData } = req.body
    //     try {
    //         const user = await Users.findByPk(user_id)
    //         if (!user) res.status(404).json({ message: 'Not found' })
    //         // como sabes que estas asignando author id en user.createTask
    //         // y no el user id...?
    //         const task = await user.createTask({
    //             ...restData,
    //             project_id: projectId

    //         })

    //         if (!task) res.status(404).json({ message: 'Not found' })
    //         res.json(task)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })




    // VERSION MANUAL
    // crear una tarea de un projecto para el usuario logueado
    router.post('/tasks/projects/:projectId', check, async (req, res) => {
        const { projectId, authorId } = req.params
        const { user_id, ...restData } = req.body

        console.log(restData)

        try {
            const task = await Model.create({
                ...restData,
                stage: 'backlog',
                ["project_id"]: projectId,
                ["author_id"]: user_id,
            })
            if (!task) res.status(404).json({ message: 'Not found' })
            res.json(task)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // gettear una tarea por id (puede no estar asociada al user logueado)
    router.get('/tasks/:id', check, async (req, res) => {

        const id = req.params.id

        try {
            const item = await Model.findByPk(id,
                {
                    include: [
                        {
                            model: Users,
                            as: 'Assigned',
                            attributes: ['name', 'email']
                        },
                        {
                            model: Comments,
                            include: [
                                {
                                    model: Users,
                                    attributes: ['name', 'email']
                                }
                            ]
                        },
                        {
                            model: Tags,
                        }
                    ],
                    attributes: ['id', 'title', 'description', 'type', 'priority', 'user_id']

                })
            if (!item) return res.status(404).json({ message: 'Not found' })
            console.log(item)
            res.json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })


    // crear promise.All para actualizar el orden de las tareas
    router.post('/tasks/order', check, async (req, res) => {
        const { user_id, ...tasks } = req.body

        try {
            const tasksToArray = Object.values(tasks)

            sequelize.transaction(async (transaction) => {
                await Promise.all(tasksToArray.map(async task => {
                    await Model.update({
                        order: task.order,
                        stage: task.stage
                    }, { where: { id: task.id }, transaction })
                }))
            })
                .then(res => console.log('Actualizado'))
                .catch(err => console.log(err))


        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // enpoint para actualizar una de todas las tareas del proyecto
    router.put('/tasks/:id', check, async (req, res) => {
        const id = req.params.id
        const { email, ...restData } = req.body



        try {
            const item = await Model.findByPk(id)
            if (!item) return res.status(404).json({ message: 'Not found' })
            const assignedId = await Users.findOne({ where: { email } })
            console.log('esta vaina es el assignedId: ', assignedId)
            if (!assignedId) {
                await item.update({ ...restData, user_id: null})
            } else {
                await item.update({ ...restData, user_id: assignedId.id })
            }
            res.json(item)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // endpoint para eliminar cualquier tarea asociada a un proyecto
    router.delete('/tasks/:task_id/projects/:project_id', check, async (req, res) => {
        const { task_id, project_id } = req.params
        try {
            const item = await Model.findByPk(task_id, { where: { project_id } })
            if (!item) return res.status(404).json({ message: 'Not found' })
            // delete the relationship between tag and task with nm
            await item.destroy()
            res.json({ message: 'Item deleted' })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })




    // todas las tareas que tiene un usuario
    // router.get('/tasks/users/:userId', async (req, res) => {
    //     const {userId} = req.params
    //     try {
    //         const users = await Model.findAll({
    //             where: {
    //                 ["user_id"]: userId
    //             }
    //         })

    //         if (!users) res.status(404).json({ message: 'Not found' })
    //         res.json(users)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    // muestro todas las tareas del user logeado - no sirve
    router.get('/tasksByUser', check, async (req, res) => {
        const { user_id } = req.body
        try {
            const tasks = await Model.findAll({
                where: { author_id: user_id }
            })
            if (!tasks) res.status(404).json({ message: 'Not found' })
            res.json(tasks)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })

    // regular (serviría para un filter): todas las tareas que tiene un proyecto cuyo usuario el el logueado
    // router.get('/tasks/projects/:projectId',check, async (req, res) => {
    //     const { projectId } = req.params
    //     const {user_id} = req.body
    //     try {
    //         const tasks = await Model.findAll({
    //             where: {
    //                 ["project_id"]: projectId,
    //             }
    //         })
    //         if (!tasks) return res.status(404).json({ message: 'Not found' })
    //         const send = tasks.every(task => task.author_id === user_id)
    //         if (!send) return res.status(401).json({ message: 'Unauthorized' })
    //         res.json(tasks)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    // DUPLICADO: todas las tareas que tiene un proyecto 
    // router.get('/tasks/projects/:projectId',check, async (req, res) => {
    //     const { projectId } = req.params
    //     try {
    //         const tasks = await Model.findAll({
    //             where: {
    //                 ["project_id"]: projectId,
    //             },
    //             include: [Tags, Comments, Users]
    //             // hay que incluir comentarios tb include: [Tags, Comments]
    //         })
    //         if (!tasks) return res.status(404).json({ message: 'Not found' })
    //         res.json(tasks)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })
    // todas las tareas que tiene un proyecto 
    router.get('/tasks/projects/:projectId', check, async (req, res) => {
        const { projectId } = req.params
        try {
            const tasks = await Model.findAll({
                where: {
                    ["project_id"]: projectId,
                },
                include: [{
                    model: Tags
                }, {
                    model: Users,
                    as: 'Assigned',
                    attributes: ['id', 'name']
                }]
                // hay que incluir comentarios tb include: [Tags, Comments]
            })
            if (!tasks) return res.status(404).json({ message: 'Not found' })

            // sequelize.query(`SELECT tasks.id, tasks.description, tasks.priority, tasks.project_id, tasks.stage, tasks.order, tasks.user_id, tasks.author_id, tasks.title, tasks.createdAt, tasks.updatedAt, users.name FROM tasks inner join users on tasks.user_id = users.id where project_id = ${projectId}`, {type: QueryTypes.SELECT})
            //     .then(result => {
            //         // result.map(e => {...e, })
            //         res.send(result)
            //     })
            //     .catch(error => console.log(error))
            res.json(tasks)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })




    //NOTA: no tiene mucho sentido
    // todas las tareas que ha inicializado un autor
    // router.get('/tasks/authors/:authorId', async (req, res) => {
    //     const {authorId} = req.params
    //     try {
    //         const authors = await Model.findAll({
    //             where: {
    //                 ["author_id"]: authorId
    //             }
    //         })

    //         if (!authors) res.status(404).json({ message: 'Not found' })
    //         res.json(authors)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })

    //  es innecesario y se tiene que ver cual es la fk interesante a cambiar
    // este es un update de fk de todas las fks
    // router.put('/tasks/:taskId/projects/:projectId/authors/:authorId/users/:userId', async (req, res) => {
    //     const { taskId, projectId, authorId, userId } = req.params
    //     const data = req.body
    //     try {
    //         const project = await Model.findByPk(taskId)
    //         if (!project) res.status(404).json({ message: 'Not found' })
    //         await project.update({
    //             ...data,
    //             ["project_id"]: projectId,
    //             ["user_id"]: userId,
    //             ["author_id"]: authorId
    //         })
    //         res.json(project)
    //     } catch (error) {
    //         res.status(400).json({ error: error.message })
    //     }
    // })


    //  cambiar la fk del user que está realizando la tarea si soy autor de esa tarea
    router.put('/tasks/:taskId/users/:userId', check, async (req, res) => {
        const { taskId, userId } = req.params
        const { user_id, ...restData } = req.body
        console.log(userId + ' soy el pu... pere')
        try {
            const task = await Model.findByPk(taskId)
            if (!task) return res.status(404).json({ message: 'Not found' })
            if (user_id != task.author_id) return res.status(401).json({ message: 'Unauthorized' })
            await task.update({
                ...restData,
                ["user_id"]: userId
            })
            res.json(task)
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    })
}

/*
de Tasks tengo:
- crear una task de un project para el user logueado 
- muestro todas las tareas del user logeado
- muestro todas las tareas que tiene un proyecto del user logeado
- cambio la asignación de una tarea de un usuario a otro


- CRUD super usuario
*/ 