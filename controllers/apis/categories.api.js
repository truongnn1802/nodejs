const moment = require("moment");
const CategoriesModel = require("../../models/categoriesModel.js");
exports.getAll = (req, res) => {
  CategoriesModel.getAll((result) => {
    const data =
      result.length > 0
        ? result.map((cate) => ({
            ...cate,
            cate_sub: cate.cate_sub && JSON.parse(cate.cate_sub),
            created_at: moment(cate.created_at).format("YYYY-MM-DD, h:mm:ss"),
            updated_at: moment(cate.updated_at).format("YYYY-MM-DD, h:mm:ss"),
          }))
        : [];
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

exports.getDetail = (req, res) => {
  let id = req.params.id;
  CategoriesModel.getOne(id, (result) => {
    const data =
      result.length > 0
        ? result.map((cate) => ({
            ...cate,
            created_at: moment(cate.created_at).format("YYYY-MM-DD, h:mm:ss"),
            updated_at: moment(cate.updated_at).format("YYYY-MM-DD, h:mm:ss"),
          }))
        : [];
    if (data) {
      res.status(200).json({
        message: "Fetch data succesfully.",
        status: 200,
        data: data[0],
      });
    } else {
      res.status(500).json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};
