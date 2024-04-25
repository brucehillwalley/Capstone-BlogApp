"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
// MongoDB Connection:
const mongoose = require('mongoose')

const dbConnection = () => {
    // Connect:
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB Connected')
    }).catch((err) => {
        console.log('* DB Not Connected * ', err)
    })
}

module.exports = {
    mongoose,
    dbConnection
}