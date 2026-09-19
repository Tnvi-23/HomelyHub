const express = require("express")

const {
  check,
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  signup,
  updateMe,
  updatePassword,
} = require("../controllers/authController.js");
const {writeDescription} = require("../controllers/tripController.js")

const { createProperty, getUsersProperties } = require("../controllers/propertyController.js");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/updateMe").patch(protect, updateMe);
router.route("/updateMyPassword").patch(protect, updatePassword);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/me").get(protect, check);
router.route("/generateDescription").post(protect, writeDescription)


router.route("/newAccommodation").post(protect, createProperty);
router.route("/myAccommodation").get(protect, getUsersProperties);

module.exports = router