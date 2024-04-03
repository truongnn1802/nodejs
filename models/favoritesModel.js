const connect = require("./database.js");
const uuid = require("../util/uuid.js");

module.exports = class CategoriesModel {
  constructor() {}

  static insert(req, cb) {
    const body = req.body;
    let sql = `INSERT INTO favorites (id,user_id, item_id,size,color,quantity) VALUES ('${uuid()}','${
      body.user_id
    }','${body.item_id}','${body.size}','${body.color}','${body.quantity}')`;
    connect.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        cb(result);
      }
    });
  }

  static update(req, cb) {
    const body = req.body;
    let sql = `UPDATE favorites SET color ='${body.color}' ,
     size = '${body.size}', quantity = '${body.quantity}' WHERE id='${body.id}'`;
    connect.query(sql, function (err, result) {
      console.log(err);
      if (err) {
        cb(err, null);
      }
      if (result) {
        cb(null, result);
      }
    });
  }
  static getOne(id, cb) {
    connect.query(
      `SELECT * FROM favorites WHERE id='${id}' LIMIT 1`,
      (err, data) => {
        console.log("dddd", id);
        if (data) {
          cb(data);
        }
      }
    );
  }
  static delete(id, cb) {
    connect.query(`DELETE FROM favorites WHERE id='${id}'`, (err, data) => {
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
    console.clear();
    const sql = `SELECT favorites.*, products.name as name,products.price as price,products.image_url as imgs 
    FROM favorites
    JOIN products ON favorites.item_id = products.id WHERE ${params.join(
      " AND "
    )}`;
    connect.query(sql, async (err, result) => {
      console.log(err);
      if (result) {
        cb(result);
      }
    });
  }
};
