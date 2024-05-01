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
    .get(isAdmin,like.list)
    .post(like.create)

router.route('/:id')
    .get(like.read)
    .put(isAdmin, like.update)
    .patch(isAdmin, like.update)
    .delete(like.delete)

/* ------------------------------------------------------- */
module.exports = router