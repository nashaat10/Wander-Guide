const express = require("express");
const multer = require("multer");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

// multer storage engine  to store the file in memory
const upload = multer({ dest: "public/img/users" });

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
// get current user who is logged in
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", upload.single("photo"), userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
