const express = require("express");
const loginControllers = require('../../controllers/apis/login.api.js')
const router = express.Router();
router.post(
    "/login",
    loginControllers.handleSubmit
  );
module.exports = router;
