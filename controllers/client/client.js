exports.index = (req, res, next) => {
  res.render("client/pages/home");
};

exports.shop = (req, res, next) => {
  res.render("client/pages/shop");
};

exports.product = (req, res, next) => {
  res.render("client/pages/product-detail");
};
exports.cart = (req, res, next) => {
  res.render("client/pages/shop-cart");
};
exports.checkout = (req, res, next) => {
  res.render("client/pages/checkout");
};
exports.history = (req, res, next) => {
  res.render("client/pages/purchase-history");
};
