const LoginModel = require("../../models/loginModel.js");
const { saveFile } = require("../../util/globalValueFile.js");

exports.handleSubmit = (req, res, next) => {
  LoginModel.post(req, (data) => {
    if (data && data.length > 0) {
      if (data[0].role === "admin") {
        global.account = data[0];
        saveFile(JSON.stringify({ account: data[0] }));
      }
      res.status(200).json({
        message: "Fetch data succesfully.",
        status: 200,
        data: data[0],
      });
    } else {
      res.redirect("/");
    }
  });
};
