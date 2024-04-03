const express = require("express");
const feedbacksControllers = require('../../controllers/apis/feedbacks.api.js')

const router = express.Router();
router.get("/feedbacks", feedbacksControllers.getQuery);
router.post("/feedback", feedbacksControllers.handlePost);
router.delete("/feedback", feedbacksControllers.delete);
module.exports = router;
