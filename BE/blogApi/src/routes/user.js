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

router.use(isLogin);

router.route("/").get(user.list).post(user.create);

router.get('/listdeleted', isAdmin, user.listDeleted)

router
  .route("/:id")
  .get(user.read)
  .put(user.update)
  .patch(user.update)
  .delete(user.delete);

/* ------------------------------------------------------- */
module.exports = router;
