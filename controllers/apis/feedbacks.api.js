const feedbacksModel = require("../../models/feedbacksModel.js");

exports.handlePost = (req, res, next) => {
  feedbacksModel.insert(req, (data) => {
    if (data) {
      res.status(200).json({
        message: "Thêm mới thành công",
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

exports.getQuery = (req, res) => {
  const query = req.query;
  console.log(query);
  feedbacksModel.getQuery(query, (data) => {
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

exports.delete = (req, res, next) => {
  let id = req.body.id;
  feedbacksModel.delete(id, (err, data) => {
    if (data) {
      res.status("200").json({
        message: "Xóa thành công!",
        status: 200,
      });
    } else {
      res.status("500").json({
        message: "Có lỗi.",
        status: 500,
      });
    }
  });
};
