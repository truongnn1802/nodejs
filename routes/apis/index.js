const categoriesRouteApi = require("./categoriesRoutes.api");
const productsRouteApi = require("./productsRoutes.api");
const usersRouteApi = require("./userRoutes.api");
const favoritesRouteApi = require("./favoritesRoutes.api");
const loginRouteApi = require("./loginRoutes.api");
const feedbacksApi = require("./feedback.api");
const productVariantsRoutes = require("./productVariantsRoutes.api");
const ordersRoutes = require("./orders.api");

module.exports = {
  loginRouteApi,
  categoriesRouteApi,
  productsRouteApi,
  usersRouteApi,
  favoritesRouteApi,
  feedbacksApi,
  ordersRoutes,
};
