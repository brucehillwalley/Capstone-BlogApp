"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/category:

const category = require('../controllers/category')
const { isLogin } = require('../middlewares/permissions')

// URL: /categories
router.use(isLogin)

router.route('/')
    .get(category.list)
    .post(category.create)

router.route('/:id')
    .get(category.read)
    .put(category.update)
    .patch(category.update)
    .delete(category.delete)

/* ------------------------------------------------------- */
module.exports = router