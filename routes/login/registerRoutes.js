const express = require("express");

const multer = require("multer");
const path = require("path");
const registerController = require("../../controllers/registerController.js");

const router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, "public/uploads/");
    } else {
      cb(new Error("not images"), false);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.random(Date.now()) +
        path.extname(file.originalname)
    );
  },
});
let upload = multer({ storage: storage });

router.post(
  "/sign-up",
  upload.single("img"),
  registerController.handleSubmit
);

router.get("/register", registerController.index);
module.exports = router;
