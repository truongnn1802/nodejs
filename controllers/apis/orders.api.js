const moment = require("moment");

const DetailModel = require("../../models/ordersModel.js");

exports.getAll = (req, res) => {
  DetailModel.getAll(req, (data) => {
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
    if (data) {
      DetailModel.getCount((data) => {
        res.status(200).json({
          message: "Fetch data succesfully.",
          status: 200,
          data: products,
          total: data[0].total,
        });
      });
    } else {
      res.status(500).json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};

exports.handlePost = (req, res, next) => {
  DetailModel.insert(req, (err,result) => {
    if (result) {
      res.status(200).json({
        message: "Mua hàng thành công",
        status: 200,
      });
    } else {
      res.status(500).json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};

exports.handleUpdate = (req, res, next) => {
  DetailModel.update(req, (err, result) => {
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
};
exports.getDetail = async (req, res, next) => {
  let id = req.params.id;
  DetailModel.getOne(id, (datas) => {
    const { data, product_variant } = datas;
    const products =
      data.length > 0
        ? data?.map((product) => ({
            ...product,
            imgs: product.image_url.split(","),
            product_variant,
          }))
        : [];
    if (data) {
      res.status(200).json({
        message: "Fetch data succesfully.",
        status: 200,
        data: products[0],
      });
    } else {
      res.status(500).json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};
exports.getQuery = (req, res) => {
  const query = req.query;
  DetailModel.getQuery(query, (data) => {
    if (data) {
      res.status(200).json({
        message: "Fetch data succesfully.",
        status: 200,
        data,
      });
    } else {
      res.status(500).json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};
