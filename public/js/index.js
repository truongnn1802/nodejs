document.addEventListener("DOMContentLoaded", () => {
  const btnSubmit = document.querySelector(".register");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const pass = document.getElementById("pass");
  const repass = document.getElementById("repass");
  const phone = document.getElementById("phone");
  const role = document.getElementById("role");
  const phoneRegex = /^0\d{9}$/;

  if (btnSubmit) {
    btnSubmit.addEventListener("click", (e) => {
      if (name.value.trim() === "") {
        name.classList.add("required");
        name.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        name.classList.remove("required");
      }

      if (email.value.trim() === "") {
        email.classList.add("required");
        email.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        email.classList.remove("required");
      }

      if (role.value.trim() === "") {
        role.classList.add("required");
        role.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        role.classList.remove("required");
      }

      if (pass.value.trim() === "" || repass.value.trim() === "") {
        pass.classList.add("required");
        repass.classList.add("required");
        pass.placeholder = "Nhập mật khẩu";
        repass.placeholder = "Nhập lại mật khẩu";
        e.preventDefault();
      } else if (pass.value !== repass.value) {
        pass.classList.add("required");
        repass.classList.add("required");
        pass.value = "";
        repass.value = "";
        pass.placeholder = "Mật khẩu không khớp";
        repass.placeholder = "Mật khẩu không khớp";
        e.preventDefault();
      } else {
        pass.classList.remove("required");
        repass.classList.remove("required");
      }

      const phoneValue = phone.value.trim();
      console.log(phoneRegex.test(phoneValue));
      if (!phoneRegex.test(phoneValue)) {
        phone.classList.add("required");
        phone.placeholder = "Số điện thoại không hợp lệ";
        e.preventDefault();
      } else {
        phone.classList.remove("required");
      }
    });
    const imgs = document.querySelector("#imgs");
    const fileImgs = document.querySelector("#file-img");
    if (fileImgs) {
      fileImgs.addEventListener("change", (e) => {
        const files = e.target.files;
        imgs.innerHTML = ``;
        for (let key in files) {
          if (files[Number(key)]) {
            const url = URL.createObjectURL(files[Number(key)]);
            imgs.innerHTML += `
                        <img src="${url}" style="width:100px"/>
                    `;
          }
        }
      });
    }
  }

  // login
  document.querySelector(".login").addEventListener("click", async (e) => {
    e.preventDefault();
    const url = "http://localhost:3000/apis/login";
    try {
      const response = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, pass: pass.value }), // Truyền dữ liệu form vào phần thân yêu cầu
      });
      response
        .then((result) => {
          return result.json();
        })
        .then((res) => {
          const { data, status, message } = res;
          if (status == 200 && data) {
            if (data.role == "admin") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/client";
              localStorage.setItem("account", JSON.stringify(data));
            }
          } else {
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
        });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});
