const express = require("express");
const productVariantsController = require("../../controllers/apis/productVariant.api");

const router = express.Router();

router.put("/product-variant", productVariantsController.handleUpdate);
module.exports = router;
