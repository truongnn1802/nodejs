const express = require("express");
const clientControllers = require('../../controllers/client/client.js')

const router = express.Router();
router.get("/", clientControllers.index);
router.get("/shop", clientControllers.shop);
router.get("/product-detail", clientControllers.product);
router.get("/shop-cart", clientControllers.cart);
router.get("/checkout", clientControllers.checkout);
router.get("/purchase-history", clientControllers.history);

module.exports = router;
