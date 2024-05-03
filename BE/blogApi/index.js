"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// import express from 'express'
//require yerine import kullanmak için package.json'a // "type": "module", // eklenir
const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require('express-async-errors')

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()
/* ------------------------------------------------------- */
//* DOCUMENTATION:
// https://swagger-autogen.github.io/docs/
// $ npm i swagger-autogen
// $ npm i swagger-ui-express
// $ npm i redoc-express

//? JSON
app.use('/documents/json', (req, res) => {
    res.sendFile('swagger.json', { root: '.' })
})

//? SWAGGER:
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./swagger.json')
app.use('/documents/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJson, { swaggerOptions: { persistAuthorization: true } }))

//? REDOC:
const redoc = require('redoc-express')
app.use('/documents/redoc', redoc({
    title: 'PersonnelAPI',
    specUrl: '/documents/json'
}))

/* ------------------------------------------------------- */

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

// CORS:
app.use(require('cors')()) // Run with defaults.

// Call static uploadFile:
// app.use('/upload', express.static('./upload'))

// Check Authentication:
app.use(require('./src/middlewares/authentication'))

// Run Logger:
// app.use(require('./src/middlewares/logger'))

// res.getModelList():
app.use(require('./src/middlewares/findSearchSortPage'))

/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome BlogAPI',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        },
        user: req.user
    })
})

// Routes:
app.use(require('./src/routes'))

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))

// RUN SERVER:
app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`))

/* ------------------------------------------------------- */
// Syncronization (must be in commentLine):
// require('./src/helpers/sync')() // !!! It clear database.