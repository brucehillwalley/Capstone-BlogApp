"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/like:

const like = require('../controllers/like')
const { isLogin, isAdmin } = require('../middlewares/permissions')

// URL: /categories
router.use(isLogin)

router.route('/')
    .get(like.list)
    .post(like.create)

router.route('/:id')
    .get(like.read)
    .put(isAdmin, like.update)
    .patch(isAdmin,like.update)
    .delete(isAdmin,like.delete)

/* ------------------------------------------------------- */
module.exports = router