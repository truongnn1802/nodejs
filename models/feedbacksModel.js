const connect = require("./database.js");
const uuid = require("../util/uuid.js");

module.exports = class CategoriesModel {
  constructor() {}
  static getAll(cb) {
    const sql = "SELECT * FROM feedback";
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        cb(data);
      }
    });
  }
  static insert(req, cb) {
    const body = req.body;
    let sql = `INSERT INTO feedback (id,user_id,product_id,content,name) VALUES ('${uuid()}','${
      body.user_id}','${body.product_id}','${body.content}','${body.content}')`;
    connect.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        cb(result);
      }
    });
  }

  static getOne(id, cb) {
    connect.query(
      `SELECT * FROM feedback WHERE id='${id}' LIMIT 1`,
      (err, data) => {
        console.log("dddd", id);
        if (data) {
          cb(data);
        }
      }
    );
  }
  static delete(id, cb) {
    connect.query(`DELETE FROM feedback WHERE id='${id}'`, (err, data) => {
      console.log(data);
      if (err) {
        cb(err, null);
      }
      if (data) {
        cb(null, data);
      }
    });
  }
  static async getQuery(query, cb) {
    let params = [];
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        const value = query[key];
        params.push(`${key}='${value}'`);
      }
    }
    const sql = `SELECT * FROM feedback WHERE ${params.join(" AND ")}`;
    connect.query(sql, async (err, result) => {
      if (result) {
        cb(result);
      }
    });
  }
};
