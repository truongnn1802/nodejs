const express = require("express");
const productsController = require("../../controllers/apis/product.api");

const router = express.Router();

router.get("/product/:id", productsController.getDetail);
router.get("/products", productsController.getAll);
router.get("/product", productsController.getDataWithCateId);
module.exports = router;
