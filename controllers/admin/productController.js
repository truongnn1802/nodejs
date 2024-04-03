const moment = require("moment");
const multer = require("multer");
const path = require("path");

const ProductModel = require("../../models/productModel.js");
const CategoriesModel = require("../../models/categoriesModel.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Thư mục 'uploads/' sẽ chứa ảnh được tải lên
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.random(Date.now()) +
        path.extname(file.originalname)
    );
  },
});

// Khởi tạo bộ tải lên
const upload = multer({ storage }).array("img", 10);

exports.index = (req, res, next) => {
  ProductModel.getAll(req, (data) => {
    const products =
      data?.length > 0
        ? data.map((product) => ({
            ...product,
            img: product.image_url.split(",")[0],
            created_at: moment(product.created_at).format(
              "YYYY-MM-DD, h:mm:ss"
            ),
            updated_at: moment(product.updated_at).format(
              "YYYY-MM-DD, h:mm:ss"
            ),
          }))
        : [];
    res.render("admin/pages/list-product", { products });
  });
};

//form add product
exports.add = (req, res) => {
  CategoriesModel.getAll((data) => {
    const cates = data.length > 0 ? data : [];
    res.render("admin/pages/add-product", { cates });
  });
};

exports.handlePost = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Xử lý lỗi từ multer
      return res.status(500).json(err);
    } else if (err) {
      // Xử lý lỗi khác
      return res.status(500).json(err);
    }
    ProductModel.insert(req, () => {
      res.redirect("/admin/add-product");
    });
  });
};

exports.handleUpdate = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Xử lý lỗi từ multer
      return res.status(500).json(err);
    } else if (err) {
      // Xử lý lỗi khác
      return res.status(500).json(err);
    }
    ProductModel.update(req, () => {
      res.redirect("/admin/list-product");
    });
  });
};

exports.getDetail = async (req, res, next) => {
  let id = req.params.id;
  const catePromise = new Promise((resolve, reject) => {
    CategoriesModel.getAll((data) => {
      const cates =
        data.length > 0
          ? data.map((cate) => ({
              ...cate,
              cate_sub: JSON.parse(cate.cate_sub),
            }))
          : [];
      resolve(cates); // Giải quyết Promise với dữ liệu danh mục
    });
  });
  const productPromise = new Promise((resolve, reject) => {
    ProductModel.getOne(id, (datas) => {
      const { data, product_variant } = datas;
      const products =
        data.length > 0
          ? data?.map((product) => ({
              ...product,
              imgs: product.image_url.split(","),
            }))
          : [];
      resolve({ products, product_variant }); // Giải quyết Promise với dữ liệu danh mục
    });
  });
  Promise.all([productPromise, catePromise])
    .then((data) => {
      const product = data[0].products[0];
      const product_variant = data[0].product_variant;
      const cates = data[1];
      const variant = product_variant
        ?.map((item) => ({
          [item.color]: JSON.parse(item.type),
        }))
        .reduce((result, currentValue) => {
          return { ...result, ...currentValue };
        }, {});
      const newArr = [];
      let index = 0;
      for (const color in variant) {
        if (Object.hasOwnProperty.call(variant, color)) {
          const element = variant[color];
          for (const type of element) {
            newArr.push({
              id: product_variant[index]?.id,
              color,
              size: Object.keys(type)?.[0],
              quantity: Number(Object.values(type)?.[0]),
            });
          }
          index++;
        }
      }
      res.render("admin/pages/update-product", {
        product,
        cates,
        product_variant: newArr,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  ProductModel.delete(id, (data) => {
    if (data) res.redirect("/admin/list-product");
  });
};
