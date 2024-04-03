const connect = require("./database.js");
const uuid = require("../util/uuid.js");

module.exports = class ProductVariantModel {
  constructor() {}
  static getAll(cb) {
    const sql = `SELECT * FROM product_variant`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        cb(data);
      }
    });
  }

  static getIdProduct(id, cb) {
    const sql = `SELECT * FROM product_variant WHERE product_id='${id}'`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        cb(data);
      }
    });
  }

  static getQuery(req, cb) {
    const sql = `SELECT * FROM product_variant WHERE id='${req.body.id}' AND color='${req.body.color}'`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        cb(data);
      }
    });
  }

  static handleUpdate = (req, cb) => {
    const body = req.body;
    let sql = `UPDATE product_variant SET 
    color = '${body.color}',
    type='${JSON.stringify(body.type)}' WHERE id = '${body.id}'`;
    connect.query(sql, function (err, result) {
      if (err) {
        cb(result, null);
        throw err;
      }
      if (result) {
        cb(null, result);
      }
    });
  };

  static getOne(id, cb) {
    const sql = `SELECT * FROM product_variant WHERE id=${id}`;
    connect.query(sql, (err, data) => {
      if (data) {
        cb(data);
      }
    });
  }
  static delete(id, cb) {
    connect.query(`DELETE FROM products WHERE id='${id}'`, (err, data) => {
      if (data) {
        cb(data);
      }
    });
  }
};
