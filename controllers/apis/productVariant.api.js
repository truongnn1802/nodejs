const ProductVariantModel = require("../../models/productVariantModel.js");

exports.handleUpdate = (req, res, next) => {
  ProductVariantModel.getQuery(req, (data) => {
    if (data.length > 0) {
      var type = JSON.parse(data[0].type);
      type = type.map((t) => {
        if (t[req.body.size]) {
          return {
            ...t,
            [req.body.size]: req.body.quantity + "",
          };
        } else {
          return t;
        }
      });
    }
    req.body = { ...req.body, type };
    ProductVariantModel.handleUpdate(req, (err, result) => {
      if (result) {
        res.status(200).json({
          message: "Cập nhật thành công.",
          status: 200,
        });
      } else {
        res.status(500).json({
          message: "Có lỗi.",
          status: 500,
        });
      }
    });
  });
};
