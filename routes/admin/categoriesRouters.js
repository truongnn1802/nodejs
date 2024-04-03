const express = require("express");
const categoriesControllers = require('../../controllers/admin/categoriesController.js')

const router = express.Router();
router.get("/list-category", categoriesControllers.index);
router.get("/add-category", categoriesControllers.add);
// /admin/add-product => POST
router.post(
  "/create-category",
  categoriesControllers.handlePost
);
router.post(
  "/update-category",
  categoriesControllers.handleUpdate
);
router.get("/category/:id", categoriesControllers.getDetail);
router.get("/delete-category/:id", categoriesControllers.handleDelete);
module.exports = router;
