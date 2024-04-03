const express = require("express");
const loginControllers = require('../../controllers/loginController.js')
const router = express.Router();
router.get("/", loginControllers.index);
module.exports = router;
