const connect = require("./database.js");
const uuid = require("../util/uuid.js");
const OrderDetailModel = require("./orderDetail.js");

module.exports = class ProductModel {
  constructor() {}
  static getAll(req, cb) {
    const sql = `SELECT * FROM orders LIMIT 10 OFFSET ${
      req?.query?._page || 0
    }`;
    connect.query(sql, async (err, result) => {
      if (result) {
        const listProduct =
          result.length > 0
            ? await Promise.all(
                result.map(async (product) => {
                  const data = await new Promise((resolve, reject) => {
                    OrderDetailModel.getIdProduct(product.id, (result) => {
                      resolve(result);
                    });
                  });
                  const sub =
                    data?.length > 0
                      ? data.map((p) => ({
                          size: p.size,
                          quantity: p.quantity,
                          color: p.color,
                        }))
                      : [];
                  return { ...product, sub };
                })
              )
            : [];
        cb(listProduct);
      }
    });
  }

  static insert(req, cb) {
    const body = req.body;
    const products = req.body.products;
    const order_id = uuid();
    var sql = `INSERT INTO orders (id, user_id, name, address, phone, note,email,status,payment)
              VALUES ('${order_id}','${body.user_id}', '${body.name}', '${body.address}', '${body.phone}', '${body.note}','${body.email}','0','${body.payment}')`;
    connect.query(sql, async function (err, result) {
      if (err) {
        console.error(err);
        throw err;
      }
      if (result) {
        const promises = [];
        for (const product of products) {
          const body = { ...product, order_id };
          promises.push(
            new Promise((resolve, reject) => {
              OrderDetailModel.insert(body, (data) => {
                if (data) {
                  resolve(data);
                } else {
                  reject(data);
                }
              });
            })
          );
        }
        Promise.all(promises)
          .then((res) => {
            cb(null, result);
          })
          .catch((err) => {
            cb(err, null);
          });
      }
    });
  }
  static update(req, cb) {
    const body = req.body;
    let sql = `UPDATE orders SET status ='1'  WHERE id='${body.id}'`;
    connect.query(sql, async function (err, result) {
      if (err) throw err;
      if (result) {
        cb();
      }
    });
  }
  static async getOne(id, cb) {
    const sql = `SELECT * FROM orders WHERE id='${id}'`;
    const productVariant = new Promise((resolve, reject) => {
      OrderDetailModel.getIdProduct(id, (data) => {
        resolve(data);
      });
    });

    connect.query(sql, async (err, data) => {
      if (data) {
        let product_variant = null;
        await productVariant.then((result) => {
          product_variant = result;
        });
        cb({ data, product_variant });
      }
    });
  }
  static async getCount(cb) {
    const sql = `SELECT COUNT(*) AS total FROM orders LIMIT 1;`;
    connect.query(sql, async (err, data) => {
      if (data) {
        cb(data);
      }
    });
  }
  static async delete(id, cb) {
    connect.query(
      `DELETE FROM product_variant WHERE product_id='${id}'`,
      function (err, result) {
        if (err) {
          throw err;
        }
        if (result) {
          connect.query(`DELETE FROM orders WHERE id='${id}'`, (err, data) => {
            if (data) {
              cb(data);
            }
          });
        }
      }
    );
  }
  static async getQuery(query, cb) {
    let params = [];
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        const value = query[key];
        if (value.split(",").length > 1) {
          params.push(`${key}>='${value.split(",")[0]}'`);
          params.push(`${key}<='${value.split(",")[1]}'`);
        } else {
          params.push(`${key}='${value}'`);
        }
      }
    }
    const sql = `SELECT * FROM orders WHERE ${params.join(
      " AND "
    )} LIMIT 10 OFFSET ${query?._page || 0}`;
    connect.query(sql, async (err, result) => {
      console.log(err);
      if (result) {
        console.clear();
        const listProduct =
          result.length > 0
            ? await Promise.all(
                result.map(async (product) => {
                  return new Promise((resolve, reject) => {
                    OrderDetailModel.getIdProduct(product.id, (data) => {
                      resolve(data[0]);
                    });
                  });
                })
              )
            : [];
        // console.clear()
        console.log(listProduct);
        cb(listProduct);
      }
    });
  }
};
