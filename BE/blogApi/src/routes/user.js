"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | BLOG API
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/user:

const user = require("../controllers/user");
const { isAdmin, isLogin } = require("../middlewares/permissions");

// URL: /users

router.route("/").get(isLogin, user.list).post(user.create);

router.get('/listdeleted', isAdmin, user.listDeleted)

router
  .route("/:id")
  .get(isLogin, user.read)
  .put(isLogin, user.update)
  .patch(isLogin, user.update)
  .delete(isLogin, user.delete);

/* ------------------------------------------------------- */
module.exports = router;
