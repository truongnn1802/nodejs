const connect = require("./database.js");
const uuid = require("../util/uuid.js");

module.exports = class OrderDetailModel {
  constructor() {}
  static getAll(cb) {
    const sql = `SELECT * FROM order_detail`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        cb(data);
      }
    });
  }

  static insert(body, cb) {
    var sql = `INSERT INTO order_detail (id, order_id,product_id, size, color, quantity)
              VALUES ('${uuid()}', '${body.order_id}','${body.product_id}', '${body.size}', '${body.color}', '${body.quantity}')`;
    connect.query(sql, async function (err, result) {
      if (err) {
        console.error(err);
        throw err;
      }
      if (result) {
        if(result){
            cb(result)
        }
      }
    });
  }

  static getIdProduct(id, cb) {
    const sql = `SELECT * FROM order_detail WHERE order_id='${id}'`;
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
    const sql = `SELECT * FROM order_detail WHERE id='${req.body.id}' AND color='${req.body.color}'`;
    connect.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        cb(data);
      }
    });
  }

  static getOne(id, cb) {
    const sql = `SELECT * FROM order_detail WHERE id=${id}`;
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
