const express = require("express");
const categoriesControllers = require('../../controllers/apis/categories.api.js')

const router = express.Router();
router.get(
  "/categories",
  categoriesControllers.getAll
);
router.get("/categories/:id", categoriesControllers.getDetail);
module.exports = router;
