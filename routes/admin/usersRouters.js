const express = require("express");
const usersControllers = require("../../controllers/admin/usersController.js");
const router = express.Router();
router.get("/list-user", usersControllers.getAll);
router.get("/delete-user/:id", usersControllers.delete);

module.exports = router;
