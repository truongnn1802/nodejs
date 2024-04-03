const UserModel = require("../../models/usersModel.js");

exports.getAll = (req, res) => {
  UserModel.getAll((data) => {
    const users = data.filter((user) => user.role === "client");
    res.render("admin/pages/list-user", { users });
  });
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  UserModel.delete(id, (data) => {
    if (data && data.length > 0) {
      res.redirect('/list-user')
    } 
  });
};
