import { getAllCate } from "../services/categories.js";
import { getQuery as getQueryProduct } from "../services/products.js";
import {
  postFavorites,
  deleteFavorites,
  getFavorite,
} from "../services/favorites.js";
import { daysBetweenDates } from "../util/utils.js";

let query = null;
let size = 0;
let page = 1;
const renderCategories = async () => {
  const handleErr = () => {};
  const listCate = await getAllCate(handleErr);
  const listCateDiv = document.querySelector("#accordion");
  listCateDiv.innerHTML = "";
  listCate.forEach((cate, index) => {
    const cate_sub = cate.cate_sub?.map(
      (sub) =>
        `<li><a data-id='${sub.key}' data-parent='${cate.name}' style='cursor:pointer'>${sub.value}</a></li>`
    );
    listCateDiv.innerHTML += `
    <div class="card">
        <div class="card-heading active">
            <a data-toggle="collapse" data-target="#collapse_${index}">${
      cate?.name
    }</a>
        </div>
        <div id="collapse_${index}" class="collapse show" data-parent="#accordion">
            <div class="card-body">
                <ul>
                   ${cate_sub.join("")}
                </ul>
            </div>
            </div>
    </div>`;
  });
  listCateDiv.querySelectorAll("li > a").forEach((item) => {
    item.addEventListener("click", async () => {
      const cateSubId = item.getAttribute("data-id");
      renderProducts({ cate_sub: cateSubId });
      document.querySelector("#sub_cate_choose").textContent = `${
        item.getAttribute("data-parent") + " " + item.textContent
      }`;
    });
  });
};

const renderProducts = async (params = null) => {
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};

  const account = JSON.parse(localStorage.getItem("account"));
  query = { ...query, ...params };
  const listFoverite = getFavorite({ user_id: account.id }, handleErr);
  const getProducts = getQueryProduct(query, handleErr);
  const getPromise = await Promise.all([getProducts, listFoverite]);
  size = getPromise[0]?.total;
  const listProduct = getPromise[0]?.data.map((product) => {
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
      <div class="col-lg-4">
      <div class="product__item card" data-id=${product.id}>
        <div
          class="product__item__pic set-bg"
          style="background-image:url('/uploads/${product.image_url}')"
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
          <h6><a>${product.name}</a></h6>
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
      "<span style='display:inline-block;margin:20px auto'>Không có sản phẩm</span>";
  }
};

const filterPrice = () => {
  const price_min = document.querySelector("#minamount");
  const price_max = document.querySelector("#maxamount");
  document
    .querySelector(".sidebar__filter > a")
    .addEventListener("click", async () => {
      console.log(price_min.value.slice(0, -2).split(".").join(""));
      const data = {
        price: [
          parseFloat(price_min.value.slice(0, -2).split(".").join("")),
          parseFloat(price_max.value.slice(0, -2).split(".").join("")),
        ],
      };
      query = { ...query, ...data };
      renderProducts(query);
    });
};
const pagination = () => {
  const pages = document.querySelector(".pagination__option");
  const totalPage = Math.ceil(size / 10);
  pages.innerHTML = "";
  new Array(totalPage).fill().forEach((i, index) => {
    pages.innerHTML += `
    <a class='${page == index + 1 && 'active'}'>${index + 1}</a>`;
  });
  pages.querySelectorAll("a").forEach((page) => {
    page.addEventListener("click", () => {
      pages.forEach((item) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
        }
      });
      page.classList.add("active");
    });
  });
};

export const handleFileShop = async () => {
  renderCategories();
  await renderProducts();
  filterPrice();
  pagination();
};
