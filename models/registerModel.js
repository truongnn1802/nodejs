const connect = require("./database.js");

module.exports = class RegisterModel {
  constructor() {}

  static post(req, cb) {
    const body = req.body;
    const sql = `SELECT * FROM account WHERE username='${req.body.name}' OR email='${req.body.email}'`;
    connect.query(sql, function (err, result) {
      if (err) throw err;
      if (result && result.length > 0) {
        cb(result[0]);
      } else {
        const sql = `INSERT INTO account (id, username, password, role, phone, email, avatar) VALUES (UUID(),'${body.name}', '${body.pass}', '${body.role}', '${body.phone}', '${body.email}', '${req?.file?.filename}')`;
        connect.query(sql, function (err, result) {
          // console.log("result", err,result);
          if (err) throw err;
          cb(result);
        });
      }
    });
  }
};
