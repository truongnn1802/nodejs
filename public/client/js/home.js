import { getAllCate } from "../services/categories.js";
import { getQuery } from "../services/products.js";
import {
  postFavorites,
  deleteFavorites,
  getFavorite,
} from "../services/favorites.js";
import { daysBetweenDates } from "../util/utils.js";
const renderCategoriesBanner = async () => {
  const handleErr = () => {};
  const listCate = await getAllCate(handleErr);
  const listCateDiv = document.querySelector("#list-cate");
  listCateDiv.innerHTML = "";
  listCate.forEach((cate) => {
    listCateDiv.innerHTML += `
    <div class="col-lg-3 col-md-6 col-sm-6 p-0 p-0 item">
      <div
        class="categories__item categories__large__item set-bg"
        style="background-image: url(&quot;/client/asset/img/categories/category-bgr.jpg&quot;)"
      >
        <div class="categories__text">
          <h1>${cate.name}</h1>
          <a href="/client/shop">Mua Ngay</a>
        </div>
      </div>
    </div>`;
  });
};

const renderCategories = async () => {
  const handleErr = () => {};
  const listCate = await getAllCate(handleErr);
  const listCateDiv = document.querySelector(".filter__controls");
  listCateDiv.innerHTML = `<li class='active' data-filter="*">All</li>`;
  listCate.forEach((cate) => {
    listCateDiv.innerHTML += `
      <li data-filter="${cate.id}">${cate.name}</li>`;
  });

  renderProducts("*");

  const cateDivs = document.querySelectorAll(".filter__controls > li");
  cateDivs.forEach((cate) => {
    cate.addEventListener("click", () => {
      cateDivs.forEach((cate) => {
        if (cate.classList.contains("active")) {
          cate.classList.remove("active");
        }
        cate.addEventListener("click", () => {
          cate.classList.add("active");
        });
      });
      cate.classList.add("active");
      const category_id = cate.getAttribute("data-filter");
      renderProducts(category_id);
    });
  });
};

const renderProducts = async (category_id = "*") => {
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};
  let params = null;
  if (category_id != "*") {
    params = { category_id };
  }
  const account = JSON.parse(localStorage.getItem("account"));

  const getProducts = getQuery(params, handleErr);
  const listFoverite = getFavorite({ user_id: account.id }, handleErr);
  const getPromise = await Promise.all([getProducts, listFoverite]);
  const listProduct = getPromise?.[0]?.data?.map((product) => {
    const favorite = getPromise[1].filter((item) => item.item_id == product.id);
    return {
      ...product,
      favorite_id: favorite[0]?.id,
    };
  });
  countFavorite.textContent = getPromise?.[1].length || 0;
  const productFilterDiv = document.querySelector(".property__gallery");
  productFilterDiv.innerHTML = "";
  if (listProduct?.length > 0) {
    listProduct.forEach((product) => {
      const quantity = product?.sub.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.quantity;
      }, 0);
      const days = daysBetweenDates(new Date(product.created_at), new Date());
      productFilterDiv.innerHTML += `
      <div class="col-lg-3">
      <div class="product__item card" data-id=${product.id}>
        <div
          class="product__item__pic set-bg"
          style="background-image:url('/uploads/${product.image_url.split(',')?.[0]}')"
        >
        <div class="label">
          <span class="new" style="background-color:#36a300;padding:2px 4px; ${
            days > 7 ? "display:none" : ""
          }">New</span>
          <span class="sale" style="background-color:#ca1515;padding:2px 4px;${
            product.sale == 0 ? "display:none" : ""
          }">Sale</span>
          <span class="stockout" style="background-color:#111111;padding:2px 4px;${
            quantity !== 0 ? "display:none" : ""
          }">out of stock</span>
        </div>
          <ul class="product__hover">
            <li>
              <a
                href="/uploads/${product.image_url}"
                class="image-popup"
                ><span class="arrow_expand"></span
              ></a>
            </li>
            <li>
              <a class='${product.favorite_id ? "active-favorites" : ""}'
              ${
                product.favorite_id
                  ? "data-id='" + product.favorite_id + "'"
                  : ""
              }
              ><span class="icon_heart_alt" style='width:100%;height:100%' data-id=${
                product.id
              }></span></a>
            </li>
          </ul>
        </div>
        <div class="product__item__text">
          <h6><a href="#">${product.name}</a></h6>
          <div class="rating">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
          </div>
          <div class="product__price">${Number(product.price).toLocaleString(
            "vi-VN",
            {
              style: "currency",
              currency: "VND",
            }
          )}</div>
        </div>
      </div>
    </div>
      `;
    });
    document.querySelectorAll(".product__item.card").forEach((item) => {
      item.addEventListener("click", async () => {
        window.location.href = "/client/product-detail";
        sessionStorage.setItem("product_id", item.getAttribute("data-id"));
      });
    });
    productFilterDiv.querySelectorAll(".icon_heart_alt").forEach((item) => {
      item.addEventListener("click", async (event) => {
        event.stopPropagation();
        try {
          const favoriteTag = item.parentNode;
          if (favoriteTag.getAttribute("data-id")) {
            const status = await deleteFavorites(
              favoriteTag.getAttribute("data-id")
            );
            if (status) {
              favoriteTag.classList.remove("active-favorites");
              favoriteTag.removeAttribute("data-id");
              countFavorite.textContent = `${
                Number(countFavorite.textContent) - 1
              }`;
            }
          } else {
            const body = {
              user_id: account.id,
              item_id: item.getAttribute("data-id"),
            };
            const { status, data } = await postFavorites(body);
            if (status == 200) {
              favoriteTag.classList.add("active-favorites");
              favoriteTag.setAttribute("data-id", data?.id);
              countFavorite.textContent = `${
                Number(countFavorite.textContent) + 1
              }`;
            }
          }
        } catch (error) {}
      });
    });
  } else {
    productFilterDiv.innerHTML =
      "<span style='display:inline-block;margin:auto'>Không có sản phẩm</span>";
  }
};

export const handleFileHome = async () => {
  renderCategoriesBanner();
  renderCategories();
};
