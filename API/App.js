// imports
const express = require('express')
const cors = require('cors')
const routes = require('./routes/indexRoutes')


// constants
const PORT = 3000
const app = express()

// uses
app.use(express.json())
app.use(cors())
    // routes
    app.use('/api', routes)



app.listen(PORT, () => {
    console.log('server listening at port 3000')
})