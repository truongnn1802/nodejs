const connect = require("./database.js");
const uuid = require("../util/uuid.js");
const ProductVariantModel = require("./productVariantModel.js");

module.exports = class ProductModel {
  constructor() {}
  static getAll(req, cb) {
    const sql = `SELECT * FROM products LIMIT 10 OFFSET ${
      req?.query?._page || 0
    }`;
    connect.query(sql, async (err, result) => {
      if (result) {
        const listProduct =
          result.length > 0
            ? await Promise.all(
                result.map(async (product) => {
                  const data = await new Promise((resolve, reject) => {
                    ProductVariantModel.getIdProduct(product.id, (result) => {
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
    const idProduct = uuid();
    if (!req.files) {
      const error = new Error("please upload a file");
      return false;
    }
    const imgUrls = req.files.map((file) => file.filename).join(",");
    var sql = `INSERT INTO products (id, name, price, description, image_url, category_id,cate_sub)
              VALUES ('${idProduct}', '${body.name}', '${body.price}', '${body.desc}', '${imgUrls}', '${body.idCate}','${body.cate_sub}')`;
    connect.query(sql, async function (err, result) {
      if (err) {
        console.error(err);
        throw err;
      }
      if (result) {
        let objType = {};
        for (let i = 0; i < body.color.length; i++) {
          if (body.color[i] != "" && body.size[i] && body.quantity[i]) {
            const color = body.color;
            if (body.size[i] !== "" && body.quantity[i] != "") {
              objType = {
                ...objType,
                [color[i]]: objType?.[color[i]]
                  ? [
                      ...objType?.[color[i]],
                      { [body.size[i]]: body.quantity[i] },
                    ]
                  : [{ [body.size[i]]: body.quantity[i] }],
              };
            }
          }
        }
        for (const color in objType) {
          if (Object.hasOwnProperty.call(objType, color)) {
            let sql = `INSERT INTO product_variant (id, product_id, color, type)
           VALUES ('${uuid()}', '${idProduct}', '${color}',
           '${JSON.stringify(objType[color])}')`;
            await new Promise((resolve, reject) => {
              connect.query(sql, function (err, result) {
                if (err) {
                  console.error(err);
                  throw err;
                }
                if (result) {
                  resolve(result);
                }
              });
            });
          }
        }

        cb();
      }
    });
  }
  static update(req, cb) {
    const body = req.body;
    const imgUrls =
      req?.files?.length > 0
        ? req.files.map((file) => file.filename).join(",")
        : null;
    let sql = `UPDATE products SET name ='${body.name}' , description = '${
      body.desc
    }',price = '${body.price}',${
      imgUrls ? "image_url='" + imgUrls + "'," : ""
    }category_id = '${body.idCate}',cate_sub='${body.cate_sub}'  WHERE id='${
      body.id
    }'`;
    connect.query(sql, async function (err, result) {
      if (err) throw err;
      if (result) {
        let objType = {};
        for (let i = 0; i < body.color.length; i++) {
          if (body.size[i] != "" && body.quantity[i] != "") {
            const color = body.color;
            if (body.size[i] !== "" && body.quantity[i] != "") {
              objType = {
                ...objType,
                [color[i]]: objType?.[color[i]]
                  ? [
                      ...objType?.[color[i]],
                      { [body.size[i]]: body.quantity[i] },
                    ]
                  : [{ [body.size[i]]: body.quantity[i] }],
              };
            }
          }
        }
        let index = 0;
        for (const color in objType) {
          if (Object.hasOwnProperty.call(objType, color)) {
            let sql = `UPDATE product_variant SET 
            color = '${color}',
            type='${JSON.stringify(objType[color])}' WHERE id = '${
              body.id_variant?.[index]
            }'`;
            await new Promise((resolve, reject) => {
              connect.query(sql, function (err, result) {
                if (err) {
                  console.error(err);
                  throw err;
                }
                if (result) {
                  resolve(result);
                }
              });
            });
            index++;
          }
        }
        cb();
      }
    });
  }
  static async getOne(id, cb) {
    const sql = `SELECT * FROM products WHERE id='${id}'`;
    const productVariant = new Promise((resolve, reject) => {
      ProductVariantModel.getIdProduct(id, (data) => {
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
    const sql = `SELECT COUNT(*) AS total FROM products LIMIT 1;`;
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
          connect.query(
            `DELETE FROM products WHERE id='${id}'`,
            (err, data) => {
              if (data) {
                cb(data);
              }
            }
          );
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
    const sql = `SELECT * FROM products WHERE ${params.join(
      " AND "
    )} LIMIT 10 OFFSET ${query?._page || 0}`;
    connect.query(sql, async (err, result) => {
      console.log(err);
      if (result) {
        const listProduct =
          result.length > 0
            ? await Promise.all(
                result.map(async (product) => {
                  const data = await new Promise((resolve, reject) => {
                    ProductVariantModel.getIdProduct(product.id, (result) => {
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
};
