const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const {
	userRegistrationRules,
	handleValidationErrors,
} = require("../middleware/validators.js");

router.post(
	"/register",
	userRegistrationRules(),
	handleValidationErrors,
	authController.register
);
router.post("/login", authController.login);

module.exports = router;
