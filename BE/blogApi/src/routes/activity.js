"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/activity:

const activity = require('../controllers/activity')
const { isLogin, isAdmin } = require('../middlewares/permissions')

// URL: /categories
//? listelemek icin login'e gerek yok şimdilik
// router.use(isLogin)

router.route('/')
    .get(activity.list)
    .post(isLogin, activity.create)

router.get('/listdeleted',isAdmin,activity.listDeleted)

router.route('/:id')
    .get(isLogin,activity.read)
    .put(isLogin, activity.update)
    .patch(isLogin,activity.update)
    .delete(isLogin,activity.delete)

/* ------------------------------------------------------- */
module.exports = router