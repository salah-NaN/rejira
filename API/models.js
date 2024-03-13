const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('Regira', 'root', 'admin', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3308,
    define: {
        timestamps: false,
        raw: true
    }
})



// // models

const Users = sequelize.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
    
})


const Projects = sequelize.define('projects', {
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: Sequelize.STRING,
    },
    active: {
        type: Sequelize.TINYINT,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, { timestamps: true })


const Comments = sequelize.define('comments', {
    title: {
        type: Sequelize.STRING,
    },
    comment: {
        type: Sequelize.STRING,
    }
})


const Tags = sequelize.define('tags', {
    name_tag: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})


const Tasks = sequelize.define('tasks', {
    type: {
        type: Sequelize.ENUM('storie', 'bug', 'task'),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
    },
    priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
    },
    stage: {
        type: Sequelize.ENUM('backlog', 'ready', 'in progress', 'review', 'testing', 'done'),
    },
    title: {
        type: Sequelize.STRING,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    order: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
    }
}, { timestamps: true })



// relationships



Users.hasMany(Projects, { foreignKey: 'user_id', onDelete: 'CASCADE', hooks: true })
Projects.belongsTo(Users, { foreignKey: 'user_id' })

Users.hasMany(Comments, { foreignKey: 'user_id' })
Comments.belongsTo(Users, { foreignKey: 'user_id' })

Tasks.hasMany(Comments, { foreignKey: 'task_id', onDelete: 'CASCADE', hooks: true })
Comments.belongsTo(Tasks, { foreignKey: 'task_id' })

Tasks.belongsToMany(Tags, { through: 'NM_task_has_tag', foreignKey: 'task_id', onDelete: 'CASCADE', hooks: true})
// se tiene que eliminar el tag y la relacion del tag con la tarea 
Tags.belongsToMany(Tasks, { through: 'NM_task_has_tag', foreignKey: 'tag_id' })

Projects.hasMany(Tasks, { foreignKey: 'project_id', onDelete: 'CASCADE', hooks: true })
Tasks.belongsTo(Projects, { foreignKey: 'project_id' })

Users.hasMany(Tasks, { foreignKey: 'user_id', as: 'Assigned'})
Tasks.belongsTo(Users, { foreignKey: 'user_id', as: 'Assigned' })

Users.hasMany(Tasks, { foreignKey: 'author_id', as: 'Author' })
Tasks.belongsTo(Users, { foreignKey: 'author_id', as: 'Author' })

// tests
// console.log(Users)
// console.log(Tasks)
// console.log(Projects)
// console.log(Comments)
// console.log(Tags)

const test = async () => {
    // const user = await Users.create({
    //     name: 'marta',
    //     email: 'marta@gmail.com',
    //     password: '1234'
    // })
    // const task = await Tasks.create({
    //     title: 'delete func',
    //     description: 'super slow',
    //     type: 'storie',
    //     priority: 'medium',
    //     user_id: 1,
    //     author_id: 1, // desps de crear a marta
    //     project_id: 2,

        
    // })
    // const project = await Projects.create({
    //     title: 'todoList',
    //     description: 'super fast',
    //     active: 0,
        
    // })
}

test()

module.exports = {
    Users,
    Tasks,
    Projects,
    Comments,
    Tags,
    sequelize
}