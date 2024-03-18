// imports
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes/indexRoutes')
const nocache = require('nocache')


// constants
const PORT = 3000
const app = express()

// uses
app.use(express.json())
app.use(nocache())
app.use(cookieParser())
app.use(cors({origin:'http://localhost:5173', credentials: true}))
app.options('*', cors())
    // routes
    app.use('/api', routes)

// app.use('/', express.static(__dirname + '../../dist'))

app.listen(PORT, () => {
    console.log('server listening at port 3000')
})