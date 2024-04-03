const connect = require("./database.js");

module.exports = class LoginModel {
  constructor() {}
  static post(req, cb) {
    const user = req.body.name;
    const pass = req.body.pass;
    const sql = `SELECT * FROM account WHERE username='${user}' AND password='${pass}'`;
    connect.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        cb(result);
      }
    });
  }
};
