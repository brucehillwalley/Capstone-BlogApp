"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// ROUTER INDEX:

// URL: /

// auth:
router.use('/auth', require('./auth'))
// user:
router.use('/users', require('./user'))
// category:
router.use('/categories', require('./category'))
// activity:
router.use('/activities', require('./activity'))
// token:
router.use('/tokens', require('./token'))



// document:
// router.use('/documents', require('./document'))

/* ------------------------------------------------------- */
module.exports = router