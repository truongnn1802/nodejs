const express = require("express");
const usersControllers = require("../../controllers/apis/users.api.js");
const router = express.Router();
router.get("/list-user", usersControllers.getAll);
router.get("/delete-user/:id", usersControllers.delete);

module.exports = router;
