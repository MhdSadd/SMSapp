const router = require("express").Router();
const {
  loginGet,
  loginPost,
  dashboard,
  users_table,
  reminder_page,
  reminder_post,
  logout,
} = require("../controllers/adminController");
const { verifyPermission } = require("../config/auth");

router.route("/login").get(loginGet).post(loginPost);

router.get("/dashboard", verifyPermission, dashboard);
router.get("/user", verifyPermission, users_table);

router
  .route("/message")
  .get(verifyPermission, reminder_page)
  .post(reminder_post);

router.get("/logout", logout);

module.exports = router;
