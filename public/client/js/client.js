import { handleFileHome } from "./home.js";
import { handleFileShop } from "./shop.js";
import { handleFileProductDetail } from "./product-detail.js";
import { handleFileCart } from "./cart.js";
import { handleFileCheckout } from "./checkout.js";
import { handleFileHistory } from "./purchase-history.js";
document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  if (pathname == "/client/shop") {
    handleFileShop();
  } else if (pathname == "/client/" || pathname == "/client") {
    handleFileHome();
    carousel();
  } else if (pathname == "/client/product-detail") {
    handleFileProductDetail();
  } else if (pathname == "/client/shop-cart") {
    handleFileCart();
  } else if (pathname == "/client/checkout") {
    handleFileCheckout();
  } else if (pathname == "/client/purchase-history") {
    handleFileHistory();
  } else {
    // const products = document.querySelectorAll(".product__item");
    // products.forEach((product) => {
    //   product.addEventListener("click", () => {
    //     window.location.href = "/client/shop";
    //   });
    // });
  }
});

const carousel = () => {
  let leftPaddle = document.querySelector(".left-paddle");
  let rightPaddle = document.querySelector(".right-paddle");
  let items = document.querySelectorAll(".item");
  let itemsLength = items.length;

  // get wrapper width
  let getMenuWrapperSize = function () {
    return document.querySelector(".menu-wrapper").offsetWidth;
  };
  let menuWrapperSize = getMenuWrapperSize();
  // the wrapper is responsive
  window.addEventListener("resize", function () {
    menuWrapperSize = getMenuWrapperSize();
  });

  document.querySelector(".menu").addEventListener("scroll", function () {
    let itemSize =
      items[0]?.offsetWidth +
      parseInt(items[0]?.getComputedStyle()?.marginRight || 0);
    let getMenuSize = function () {
      return itemsLength * itemSize;
    };
    let menuSize = getMenuSize();
    let menuInvisibleSize = menuSize - menuWrapperSize;
    menuInvisibleSize = menuSize - menuWrapperSize;
  });

  // scroll to left
  rightPaddle.addEventListener("click", function () {
    let menu = document.querySelector(".menu");
    let currentPosition = menu.scrollLeft;

    menu.scrollTo(currentPosition + 300, 0);
    // let scrollInterval = setInterval(animateScroll, duration * 500);
  });

  // scroll to right
  leftPaddle.addEventListener("click", function () {
    let menu = document.querySelector(".menu");
    let currentPosition = menu.scrollLeft;

    menu.scrollTo(currentPosition - 300, 0);
  });
};
