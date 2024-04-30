"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/category:

const category = require('../controllers/category')
const { isLogin, isAdmin } = require('../middlewares/permissions')

// URL: /categories
router.use(isLogin)

router.route('/')
    .get(category.list)
    .post(category.create)
    
router.route('/:id')
    .get(category.read)
    .put(isAdmin, category.update)
    .patch(isAdmin,category.update)
    .delete(isAdmin,category.delete)

/* ------------------------------------------------------- */
module.exports = router