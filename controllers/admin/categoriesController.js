const moment = require("moment");
const CategoriesModel = require("../../models/categoriesModel.js");

exports.index = (req, res, next) => {
  CategoriesModel.getAll((data) => {
    const cates =
      data.length > 0
        ? data.map((cate) => ({
            ...cate,
            created_at: moment(cate.created_at).format("YYYY-MM-DD, h:mm:ss"),
            updated_at: moment(cate.updated_at).format("YYYY-MM-DD, h:mm:ss"),
          }))
        : [];
    res.render("admin/pages/list-category", { cates });
  });
};

//form add product
exports.add = (req, res) => {
  res.render("admin/pages/add-category");
};

exports.handlePost = (req, res, next) => {
  CategoriesModel.insert(req, (data) => {
    res.redirect("/admin/add-category");
  });
};

exports.handleUpdate = (req, res, next) => {
  CategoriesModel.update(req, () => {
    res.redirect("/admin/list-category");
  });
};

exports.getDetail = (req, res, next) => {
  let id = req.params.id;
  CategoriesModel.getOne(id, (data) => {
    res.render("admin/pages/update-category", { data: { ...data[0],cate_sub: JSON.parse(data[0]?.cate_sub) }});
  });
};

exports.handleDelete = (req, res, next) => {
  let id = req.params.id;
  CategoriesModel.delete(id, (err, data) => {
    if (err) {
      console.log(err);
      if (err.errno === 1451) {
        res.render('admin/pages/error',{text:"Không thể xóa danh mục khi đã có sản phẩm chọn",url:'admin/list-category'})
      }
    }
    if (data) {
      res.redirect("/admin/list-category");
    }
  });
};
