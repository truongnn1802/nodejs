const connect = require("./database.js");

module.exports = class CategoriesModel {
  constructor() {}
  static getAll(cb) {
    const sql = "SELECT * FROM account";
   connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        cb(data);
      }
    });
  }

  static delete(id, cb) {
    connect.query(`DELETE FROM account WHERE id='${id}'`, (err, data) => {
      if (data) {
        cb(data);
      }
    });
  }
};
