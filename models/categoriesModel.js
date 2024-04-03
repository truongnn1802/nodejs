const connect = require("./database.js");
const uuid = require("../util/uuid.js");

module.exports = class CategoriesModel {
  constructor() {}
  static getAll(cb) {
    const sql = "SELECT * FROM categories";
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
    const listCateSub =
      typeof body.cate_sub === "string" ? [body.cate_sub] : [...body.cate_sub];
    const cateSub = listCateSub
      ?.filter((cate) => cate != "")
      ?.map((cate) => ({ key: uuid(), value: cate }));
    let sql = `INSERT INTO categories (id,name, description,cate_sub) VALUES (UUID(),'${
      body.name
    }','${body.desc}','${JSON.stringify(cateSub)}')`;
    connect.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        cb();
      }
    });
  }

  static update(req, cb) {
    const body = req.body;
    const listCateSub =
      typeof body.cate_sub === "string" ? [body.cate_sub] : [...body.cate_sub];
    const listIdCateSub =
      typeof body.id_cate_sub === "string"
        ? [body.id_cate_sub]
        : [...body.id_cate_sub];
        const cateSub = listCateSub
        ?.map((cate, index) => {
          if (!listIdCateSub[index]) {
            return { key: uuid(), value: cate };
          } else {
            return { key: listIdCateSub[index], value: cate };
          }
        })
        ?.filter((cate) => cate.value != "");
    let sql = `UPDATE categories SET name ='${
      req.body.name
    }' , description = '${req.body.desc}', cate_sub='${JSON.stringify(
      cateSub
    )}' WHERE id='${body.id}'`;
    connect.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        cb();
      }
    });
  }
  static getOne(id, cb) {
    connect.query(`SELECT * FROM categories WHERE id='${id}'`, (err, data) => {
      if (data) {
        cb(data);
      }
    });
  }
  static delete(id, cb) {
    connect.query(`DELETE FROM categories WHERE id='${id}'`, (err, data) => {
      if (err) {
        cb(err, null);
      }
      if (data) {
        cb(null, data);
      }
    });
  }
};
