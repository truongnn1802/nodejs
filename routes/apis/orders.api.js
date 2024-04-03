const express = require("express");
const ordersControllers = require('../../controllers/apis/orders.api.js')

const router = express.Router();
router.get("/orders", ordersControllers.getAll);
router.get("/order", ordersControllers.getQuery);
router.post("/order", ordersControllers.handlePost);
router.put("/order", ordersControllers.handleUpdate);
module.exports = router;
