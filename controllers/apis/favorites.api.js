const FavoritesModel = require("../../models/favoritesModel.js");

exports.handlePost = (req, res, next) => {
  FavoritesModel.insert(req, (result) => {
    if (result) {
      FavoritesModel.getQuery({ item_id: req.body.item_id }, (data) => {
        if (data) {
          res.status(200).json({
            message: "Thêm mới thành công",
            status: 200,
            data:data[0],
          });
        }
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
  FavoritesModel.update(req, (err,result) => {
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

exports.getQuery = (req, res) => {
  const query = req.query;
  console.log(query);
  FavoritesModel.getQuery(query, (data) => {
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
  FavoritesModel.delete(id, (err, data) => {
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
