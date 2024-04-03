import { postOrder } from "../services/checkout.js";
import { getFavorite } from "../services/favorites.js";

const account = JSON.parse(localStorage.getItem("account"));
const products = JSON.parse(sessionStorage.getItem("cart"));
let paymentMethod = 0;
const renderProducts = async () => {
  const productsDiv = document.querySelector(".list-prd");
  productsDiv.innerHTML = ``;
  if (products.length > 0) {
    products.forEach((product, index) => {
      productsDiv.innerHTML += `
      <li>${index}. ${product.name} <span>${Number(
        product.total
      ).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}</span></li>
      `;
    });
    const payment = products.reduce(
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
  }
};

const handleForm = () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const note = document.getElementById("note");
  const address = document.getElementById("address");
  const phone = document.getElementById("phone");
  const checkout = document.querySelector(".site-btn");
  let require = true;
  const phoneRegex = /^0\d{9}$/;
  checkout.addEventListener("click", async (e) => {
    e.preventDefault();
    if (name.value.trim() === "") {
      name.classList.add("required");
      name.placeholder = "Nhập đủ dữ liệu";
      e.preventDefault();
      require = false;
    } else {
      name.classList.remove("required");
      require = true;
    }

    if (address.value.trim() === "") {
      address.classList.add("required");
      address.placeholder = "Nhập đủ dữ liệu";
      e.preventDefault();
      require = false;
    } else {
      address.classList.remove("required");
      require = true;
    }
    const phoneValue = phone.value.trim();
    if (!phoneRegex.test(phoneValue)) {
      phone.classList.add("required");
      phone.placeholder = "Số điện thoại không hợp lệ";
      e.preventDefault();
      require = false;
    } else {
      phone.classList.remove("required");
      require = true;
    }

    if (require) {
      const data = {
        user_id: account.id,
        name: name.value.trim(),
        address: address?.value.trim(),
        email: email?.value.trim(),
        phone: phone?.value.trim(),
        note: note?.value.trim(),
        status: 0,
        payment: paymentMethod,
        products,
      };
      const { status, message } = await postOrder(data);
      if (status == 200) {
        sessionStorage.setItem("cart", JSON.stringify([]));
        name.value = "";
        (address.value = ""),
          (email.value = ""),
          (phone.value = ""),
          (note.value = "");
        let timeout = null;
        if (timeout) {
          clearTimeout(timeout);
        }
        let childElement = document.createElement("p");
        childElement.textContent = message;
        childElement.classList.add("notification");
        let parentElement = document.body;
        parentElement.appendChild(childElement);
        timeout = setTimeout(() => {
          childElement.remove();
        }, 3000);
      }
    }
  });
};

export const handleFileCheckout = async () => {
  renderProducts();
  handleForm();
  const countFavorite = document.querySelector(".icon_heart_alt~.tip");
  const handleErr = () => {};

  const listFoverite = await getFavorite({ user_id: account.id }, handleErr);
  countFavorite.textContent = listFoverite.length || 0;
  document.body.addEventListener("change", function (e) {
    const qrMomo = document.querySelector("#qr-momo");
    if (e.target.value === "momo") {
      paymentMethod = 1;
      qrMomo.innerHTML = `<img src='/client/asset/img/shop-cart/qrcode.png' alt="qr-code" style="width:100px"/>`;
    } else if (e.target.value === "cash") {
      qrMomo.innerHTML = "";
      paymentMethod = 0;
    }
  });
};
