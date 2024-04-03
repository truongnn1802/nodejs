const registerModel = require("../models/registerModel.js");
let exist = { name: false, email: false };
exports.index = (req, res) => {
  res.render("pages/register", { exist });
};

exports.handleSubmit = (req, res) => {
  registerModel.post(req, (data) => {
    if (data && !data.username) {
      res.redirect("/");
      return;
    }
    if (data && data.username === req.body.name) {
      exist = { ...exist, name: true };
    }
    if (data && data.email === req.body.email) {
      exist = { ...exist, email: true };
    }
    res.redirect("/register");
  });
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  registerModel.delete(id, (data) => {
    if (data) res.redirect("/list-product");
  });
};
