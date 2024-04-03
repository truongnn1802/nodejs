const express = require("express");
const productsController = require("../../controllers/admin/productController.js");

const router = express.Router();
router.get("/list-product", productsController.index);
router.get("/add-product", productsController.add);
// /admin/add-product => POST
router.post(
  "/create-product",
  productsController.handlePost
);
router.post(
  "/update-product",
  productsController.handleUpdate
);
router.get("/product/:id", productsController.getDetail);
router.get("/delete-product/:id", productsController.delete);
module.exports = router;
