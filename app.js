const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const loginRoutes = require("./routes/login/loginRoutes.js");
const registerRoutes = require("./routes/login/registerRoutes.js");
const clientRoutes = require("./routes/client/index.js");
const {
  categoriesRoute,
  productsRoute,
  usersRoute,
} = require("./routes/admin/index.js");
const {
  categoriesRouteApi,
  productsRouteApi,
  usersRouteApi,
  favoritesRouteApi,
  loginRouteApi,
  feedbacksApi,
  ordersRoutes
} = require("./routes/apis/index.js");
const { getFile } = require("./util/globalValueFile.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

const getDataFile = getFile();
if (getDataFile && JSON.parse(getDataFile)?.account) {
  global.account = JSON.parse(getDataFile)?.account;
} else {
  global.account = {};
}

const renderRoutes = (path, routes) => {
  routes.forEach((route) => {
    app.use(path, route);
  });
};

renderRoutes("/", [loginRoutes, registerRoutes]);
renderRoutes("/admin", [categoriesRoute, productsRoute,usersRoute]);
renderRoutes("/apis", [
  usersRouteApi,
  productsRouteApi,
  categoriesRouteApi,
  favoritesRouteApi,
  loginRouteApi,
  feedbacksApi,
  ordersRoutes
]);
renderRoutes("/client", [clientRoutes]);

/*------------------------------------------------------------------*/
app.get("/admin", (req, res) => {
  res.render("admin/pages/home");
});
/*------------------------------------Client-------------------------*/
app.listen(port, () => {
  console.log("Serve run on http://localhost:" + 3000);
});
