import { deleteFavorites, getFavorite } from "../services/favorites.js";
const account = JSON.parse(localStorage.getItem("account"));

const renderProducts = async () => {
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};

  const listFoverite = await getFavorite({ user_id: account.id }, handleErr);
  countFavorite.textContent = listFoverite.length || 0;
  // render sản phẩm ra bảng
  const tblFavoriteProductDiv = document.querySelector(".tblFavoriteProduct");
  tblFavoriteProductDiv.innerHTML = ``;
  if (listFoverite.length > 0) {
    listFoverite.forEach((favorite) => {
      tblFavoriteProductDiv.innerHTML += `
      <tr >
        <td><input type="checkbox" class="checkbox" data-id=${
          favorite.item_id
        }></td>
        <td class="cart__product__item">
            <img src="/uploads/${
              favorite.imgs.split(",")?.[0]
            }" alt="" style='width:80px;height:80px'>
            <div class="cart__product__item__title">
                <h6 data-id=${
                  favorite.item_id
                } class='name' style='cursor:pointer'>${favorite.name}</h6>
                <div class="product__details__widget" style="border: none;padding: 10px 0 0;">
                    <ul>
                      <li style='margin-bottom: 6px'>
                        <span style='width:50px'>Màu:</span>
                        ${
                          favorite.size !== "null"
                            ? ` <div class="color__checkbox"
                           style='background:${favorite.color};width:20px;
                           height:20px;
                           border-radius:50%'
                           >
                           <span id="color" style='display:none'>${favorite.color}</span>
                           </div>`
                            : `<span>Chưa chọn</span>`
                        }
                      </li>
                      <li>
                        <span style='width:50px'>Size:</span>
                        ${
                          favorite.size !== "null"
                            ? `<strong>${favorite.size}</strong>`
                            : `<span>Chưa chọn</span>`
                        }
                      </li>
                    </ul>
                  </div>
            </div>
        </td>
        <td class="cart__price">${Number(favorite.price).toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        )}</td>
        <td class="cart__quantity">
            <div class="pro-qty">
                <input type="text" value="${favorite.quantity}" readonly>
            </div>
        </td>
        <td class="cart__total">${
          Number(favorite.price) * Number(favorite.quantity)
        } đ</td>
        <td class="cart__close"><span data-id=${
          favorite.id
        } class="icon_close"></span></td>
    </tr>
      `;
    });
    document.querySelectorAll(".name").forEach((i) => {
      i.addEventListener("click", async () => {
        window.location.href = "/client/product-detail";
        sessionStorage.setItem("product_id", i.getAttribute("data-id"));
      });
    });
    document.querySelectorAll(".icon_close").forEach((icon) => {
      icon.addEventListener("click", async () => {
        const status = await deleteFavorites(icon.getAttribute("data-id"));
        if (status == 200) {
          renderProducts();
        }
      });
    });
    let productChoose = [];
    document.querySelectorAll(".checkbox").forEach((icon, index) => {
      icon.addEventListener("click", async () => {
        const id = icon.getAttribute("data-id");
        if (
          productChoose.length > 0 &&
          productChoose.filter((i) => i.product_id == id).length > 0
        ) {
          productChoose = [...productChoose.filter((i) => i.product_id !== id)];
        } else {
          const tr = icon.parentNode.parentNode;
          const totalDiv = tr.querySelector(".cart__total");
          const total = totalDiv.textContent.split(" đ")?.[0]?.trim();
          const name = tr.querySelector(".name").textContent.trim();
          const size = tr.querySelector("strong").textContent.trim();
          const color = tr.querySelector("#color").textContent.trim();
          const quantity = tr.querySelector("input[type='text']").value;
          productChoose.push({
            product_id: id,
            name,
            size,
            color,
            quantity:Number(quantity),
            total: Number(total),
          });
        }
        const payment = productChoose.reduce(
          (value, current) => (value += current.total),
          0
        );
        document.querySelector(".payment").textContent = payment.toLocaleString(
          "vi-VN",
          {
            style: "currency",
            currency: "VND",
          }
        );
      });
    });
    document.querySelector(".primary-btn").addEventListener("click", () => {
      if (document.querySelector(".payment").textContent !== "0") {
        window.location.href = "/client/checkout";
        sessionStorage.setItem(
          "cart",
          JSON.stringify(productChoose.filter((p) => p.total > 0))
        );
      } else {
        let timeout = null;
        if (timeout) {
          clearTimeout(timeout);
        }
        let childElement = document.createElement("p");
        childElement.textContent = "Bạn chưa chọn sản phẩm để mua.";
        childElement.classList.add("notification");
        let parentElement = document.body;
        parentElement.appendChild(childElement);
        timeout = setTimeout(() => {
          childElement.remove();
        }, 3000);
      }
    });
  } else {
    tblFavoriteProductDiv.textContent = `Chưa có sản phẩm`;
  }
};

export const handleFileCart = async () => {
  renderProducts();
};
