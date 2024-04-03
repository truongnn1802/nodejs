const LoginModel = require("../models/loginModel.js");
const { saveFile } = require("../util/globalValueFile.js");

exports.index = (req, res) => {
  res.render("pages/login",{message:"null"});
};
