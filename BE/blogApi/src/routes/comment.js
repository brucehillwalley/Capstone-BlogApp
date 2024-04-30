"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/comment:

const comment = require('../controllers/comment')
const { isLogin, isAdmin } = require('../middlewares/permissions')

// URL: /comments

router.route('/')
    .get(comment.list)
    .post(isLogin, comment.create)

router.get('/listdeleted',isAdmin,comment.listDeleted)

router.route('/:id')
    .get(comment.read)
    .put(isLogin, comment.update)
    .patch(isLogin, comment.update)
    .delete(isLogin, comment.delete)

/* ------------------------------------------------------- */
module.exports = router