const express = require("express");
const favoritesControllers = require('../../controllers/apis/favorites.api.js')

const router = express.Router();
router.get("/favorites", favoritesControllers.getQuery);
router.post("/favorite", favoritesControllers.handlePost);
router.put("/favorite", favoritesControllers.handleUpdate);
router.delete("/favorite", favoritesControllers.delete);
module.exports = router;
