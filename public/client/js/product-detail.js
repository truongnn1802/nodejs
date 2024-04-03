import {
  getQuery,
  getDetail,
  updateProductVariant,
} from "../services/products.js";
import { getFeedback } from "../services/feedbacks.js";
import {
  postFavorites,
  deleteFavorites,
  getFavorite,
  updateFavorites,
} from "../services/favorites.js";
import { daysBetweenDates } from "../util/utils.js";
const product_id = sessionStorage.getItem("product_id");
const account = JSON.parse(localStorage.getItem("account"));

const renderProductDetail = async () => {
  try {
    const productPicDiv = document.querySelector(".product__details__pic");
    const picLeft = productPicDiv.querySelector(".product__details__pic__left");
    const picSlider = productPicDiv.querySelector(
      ".product__details__pic__right"
    );
    const detailText = document.querySelector(".product__details__text");
    const widgetDiv = document.querySelector(".product__details__widget");
    const { data } = await getDetail(product_id);
    const { imgs, product_variant } = data;
    picLeft.innerHTML = "";
    // render ảnh
    if (imgs.length > 1) {
      imgs.forEach((img, index) => {
        if (index == 0) {
          picSlider.innerHTML = ` <img style='height:100%' src="/uploads/${img}" alt="product-${index}">`;
        }
        picLeft.innerHTML += `
          <img class='pt' style='width:100px;height:100px' src="/uploads/${img}" alt="product-${index}">
        `;
      });
      picLeft.querySelectorAll("img").forEach((img) => {
        img.addEventListener("click", () => {
          picLeft.querySelectorAll("img").forEach((img) => {
            img.style.border = "none";
          });
          img.style.border = "1px solid red";
          picSlider.innerHTML = ` <img style='height:100%' src="${img.src}" alt="${img.src}">`;
        });
      });
    } else {
      picSlider.innerHTML = ` <img style='height:100%' src="/uploads/${data.image_url}" alt="${data.image_url}">`;
    }

    detailText.querySelector("h3").textContent = data.name;
    detailText.querySelector("p").textContent = data.description;
    detailText.querySelector(".product__details__price").innerHTML = `${Number(
      ((100 - data.sale) * data.price) / 100
    ).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })}
    <span>
    ${
      data.sale !== 0
        ? Number(data.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        : ""
    }
    </span>
    `;

    //render Màu sắc và size
    let sizes = [];
    let quantity = [];
    let indexColor = 0;
    const colorDiv = widgetDiv.querySelector(".color__checkbox");
    colorDiv.innerHTML = "";
    const sizeDiv = widgetDiv.querySelector(".size__btn");
    product_variant.forEach((product, index) => {
      if (index == 0) {
        const type = JSON.parse(product.type);
        sizeDiv.innerHTML = ``;
        sizes = type.map((t) => Object.keys(t));
        quantity = type.map((t) => Object.values(t));

        document.querySelector(".quantity strong").textContent = quantity[0];
        sizes.forEach((size, index) => {
          sizeDiv.innerHTML += `
          <label for="size-${size}" class="${index == 0 ? "active" : ""}">
          <input type="radio" id="size-${size}" />
          ${size}
        </label>
          `;
        });
      }
      colorDiv.innerHTML += `
      <label for="color_${index}">
      <input type="radio" name="color__radio" id="color_${index}" ${
        index == 0 ? "checked" : ""
      } />
      <span class="checkmark" style='background:${product.color}!important'>
        <span class ='value-color' style='display:none'>${product.color}</span>
        <span class ='id-color' style='display:none'>${product.id}</span>
      </span>
    </label>
      `;
    });
    sizeDiv.querySelectorAll('input[type="radio"]').forEach((size, index) => {
      size.addEventListener("click", () => {
        sizeDiv
          .querySelectorAll('input[type="radio"]')
          .forEach((item, index) => {
            console.log(item);
            if (item.classList.contains("active"))
              item.classList.remove("active");
          });
        document.querySelector(".quantity strong").textContent =
          quantity[index];
        check(size);
        size.classList.add("active");
      });
    });

    document
      .querySelectorAll('input[name="color__radio"]')
      .forEach((input, index) => {
        input.addEventListener("click", () => {
          const type = JSON.parse(product_variant[index].type);
          const sizeDiv = widgetDiv.querySelector(".size__btn");
          sizeDiv.innerHTML = ``;
          sizes = type.map((t) => Object.keys(t));
          quantity = type.map((t) => Object.values(t));
          indexColor = index;

          document.querySelector(".quantity strong").textContent = quantity[0];
          sizes.forEach((size, index) => {
            sizeDiv.innerHTML += `
              <label for="size-${size}" class="${index == 0 ? "active" : ""}">
                <input type="radio" id="size-${size}" />
                ${size}
              </label>
              `;
          });
          check(input);
          sizeDiv.querySelectorAll("label").forEach((size, index) => {
            size.addEventListener("click", () => {
              sizeDiv.querySelectorAll("label").forEach((item) => {
                if (item.classList.contains("active"))
                  item.classList.remove("active");
              });
              document.querySelector(".quantity strong").textContent =
                quantity[index];
              check(input);
              size.classList.add("active");
            });
          });
        });
      });
    // Thêm giỏ hàng
    check();
    document
      .querySelector(".product__details__button .cart-btn")
      .addEventListener("click", async (e) => {
        e.preventDefault();
        if (
          document.querySelector(".quantity strong").textContent == "0" ||
          document.querySelector(".quantity strong").textContent == ""
        ) {
          alert("không có sản phẩm");
        } else {
          const favorite = await getFavorite({
            user_id: account.id,
            item_id: product_id,
          });

          const color = document
            .querySelectorAll(".value-color")
            ?.[indexColor]?.textContent.trim();
          const size = document
            .querySelector(".size__btn label.active")
            .textContent.trim();
          const quantity = document.querySelector(".pro-qty input")?.value;

          let res = null;
          console.clear();
          if (favorite?.[0]?.id) {
            res = await updateFavorites({
              id: favorite?.[0]?.id,
              color,
              size,
              quantity: Number(quantity),
            });
          } else {
            res = await postFavorites({
              item_id: product_id,
              user_id: account.id,
              color,
              size,
              quantity: Number(quantity),
            });
          }
          if (res.status == 200) {
            console.log(data);
            const res = await updateProductVariant({
              id: document
                .querySelectorAll(".id-color")
                ?.[indexColor]?.textContent.trim(),
              color,
              size,
              quantity:
                Number(document.querySelector(".quantity strong").textContent) -
                Number(quantity),
            });
            if (res.status == 200) {
              document.querySelector(".quantity strong").textContent =
                Number(document.querySelector(".quantity strong").textContent) -
                Number(quantity);
            }
          }
        }
      });

    // render sản phẩm thêm
    renderProducts(data.category_id);
  } catch (err) {}
};

const renderProducts = async (category_id = "*") => {
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};
  let params = null;
  if (category_id != "*") {
    params = { category_id };
  }

  const getProducts = getQuery(params, handleErr);
  const listFoverite = getFavorite({ user_id: account.id }, handleErr);
  const getPromise = await Promise.all([getProducts, listFoverite]);
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
      <div class="col-lg-3">
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

const check = (i = null) => {
  const inputCount = document.querySelector(".quantity input");
  if (
    document.querySelector(".quantity strong").textContent == "0" ||
    document.querySelector(".quantity strong").textContent == ""
  ) {
    document.querySelector(".dec.qtybtn").style.display = "none";
    document.querySelector(".inc.qtybtn").style.display = "none";
    document.querySelector(".stock__checkbox label").textContent = "Hết hàng";
    inputCount.disabled = true;
    inputCount.value = 0;
  } else {
    document.querySelector(".dec.qtybtn").style.display = "block";
    document.querySelector(".inc.qtybtn").style.display = "block";
    document.querySelector(".stock__checkbox label").textContent = "Còn hàng";
    inputCount.disabled = false;
    inputCount.value = 1;
    inputCount.max = parseInt(
      document.querySelector(".quantity strong").textContent
    );
  }
};

const feedback = async () => {
  const listFeedback = await getFeedback({ product_id });
  const feedbackDiv = document.querySelector(".list-feedback");
  if (listFeedback.length > 0) {
    feedbackDiv.innerHTML = ``;
    listFeedback.forEach((feedback) => {
      feedbackDiv.innerHTML += `
        <div>
          <h6 style='font-size:14px'>${feedback.name}</h6>
          <p style="font-size:16px">${feedback.content}</p>
        </div>
      `;
    });
  }
};

export const handleFileProductDetail = async () => {
  renderProductDetail();
  feedback();
};
