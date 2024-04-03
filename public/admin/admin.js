document.addEventListener("DOMContentLoaded", () => {
  handleAddUpdateProduct();
  handleAddUpdateCate();

  const iconDel = document.querySelectorAll(".mdi-delete-forever");
  const iconUpdate = document.querySelectorAll(".mdi-border-color");
  iconDel.forEach((del) => {
    del.addEventListener("click", async () => {
      document.getElementById("customAlert-custom").style.display = "flex";
      document.getElementById("btn-delete").addEventListener("click", () => {
        window.location.href =
          `${
            window.location.pathname === "/admin/list-product"
              ? "/admin/delete-product"
              : window.location.pathname === "/admin/list-user"
              ? "/admin/delete-user"
              : "/admin/delete-category"
          }/` + del.getAttribute("data-id");
      });
    });
  });
  iconUpdate.forEach((edit) => {
    edit.addEventListener("click", async () => {
      window.location.href =
        `${
          window.location.pathname === "/admin/list-product"
            ? "/admin/product"
            : "/admin/category"
        }/` + edit.getAttribute("data-id");
    });
  });
});

const handleAddUpdateProduct = () => {
  const price = document.querySelector("#price");
  const idCate = document.querySelector("#idCate");
  const name = document.querySelector("#name");
  const desc = document.querySelector("#desc");
  const btnSubmit = document.querySelector('button[type="submit"]');
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
  if (idCate) {
    if (idCate.value) {
      getListSub(idCate.value,true);
    }
    idCate.addEventListener("change", (e) => {
      getListSub(e.target.value);
    });
  }
  handleAddChild();
  handleAddSubCate();

  if (btnSubmit) {
    btnSubmit.addEventListener("click", (e) => {
      if (name.value.trim() == "" && !name.classList.contains("required")) {
        name.classList.add("required");
        name.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        name.classList.remove("required");
      }
      if (idCate.value.trim() == "" && !idCate.classList.contains("required")) {
        idCate.classList.add("required");
        idCate.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        idCate.classList.remove("required");
      }
      if (price.value.trim() == "" && !price.classList.contains("required")) {
        price.classList.add("required");
        price.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        price.classList.remove("required");
      }
      if (desc.value.trim() == "" && !desc.classList.contains("required")) {
        desc.classList.add("required");
        desc.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        desc.classList.remove("required");
      }
      if (imgs.innerHTML === "") {
        document.querySelector('label[for="file-img"]').style = "color:#fe7c96";
        e.preventDefault();
      } else {
      }
    });
  }
};

const handleAddUpdateCate = () => {
  const name = document.querySelector("#name");
  const desc = document.querySelector("#desc");
  const btnSubmit = document.querySelector('button[type="submit"]');
  if (btnSubmit) {
    btnSubmit.addEventListener("click", (e) => {
      if (name.value.trim() == "" && !name.classList.contains("required")) {
        name.classList.add("required");
        name.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        name.classList.remove("required");
      }
      if (desc.value.trim() == "" && !desc.classList.contains("required")) {
        desc.classList.add("required");
        desc.placeholder = "Nhập đủ dữ liệu";
        e.preventDefault();
      } else {
        desc.classList.remove("required");
      }
    });
  }
};

const handleAddChild = () => {
  const listAddDiv = document.querySelector(".add-child");
  if (listAddDiv) {
    const btnAddRow = listAddDiv.querySelector("#add-row");
    btnAddRow.addEventListener("click", () => {
      const listColor = listAddDiv.querySelectorAll('input[name="color"]')
      const newItem = document.createElement("div");
      newItem.classList.add("flex-align-center");

      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.name = "color";
      colorInput.value = listColor?.[listColor.length - 1]?.value;
      colorInput.classList.add(["product-color"]);

      const sizeInput = document.createElement("input");
      sizeInput.type = "text";
      sizeInput.name = "size";
      sizeInput.placeholder = "Nhập size";
      sizeInput.classList.add(
        "product-size",
        "form-control",
        "form-control-sm",
        "inline-block"
      );

      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.name = "quantity";
      quantityInput.placeholder = "Nhập số lượng";
      quantityInput.classList.add(
        "product-quantity",
        "form-control",
        "form-control-sm",
        "inline-block"
      );
      newItem.appendChild(colorInput);
      newItem.appendChild(sizeInput);
      newItem.appendChild(quantityInput);

      listAddDiv.appendChild(newItem);
    });
  }
};

const handleAddSubCate = () => {
  const listAddDiv = document.querySelector("#add-sub-cate");
  if (listAddDiv) {
    const btnAddRow = listAddDiv.querySelector("#add-row");
    btnAddRow.addEventListener("click", () => {
      const newItem = document.createElement("div");
      newItem.classList.add("flex-align-center");

      const sizeInput = document.createElement("input");
      sizeInput.type = "text";
      sizeInput.name = "cate_sub";
      sizeInput.placeholder = "Nhập danh mục con";
      sizeInput.classList.add("form-control");

      newItem.appendChild(sizeInput);

      listAddDiv.appendChild(newItem);
    });
  }
};

const getListSub = (value,setValue=false) => {
  fetch("http://localhost:3000/apis/categories/" + value)
    .then((data) => {
      return data.json();
    })
    .then((result) => {
      if (result.status === 200) {
        const cateSelect = document.querySelector("#idCateSub");
        cateSelect.innerHTML = "";
        const listCateSub = JSON.parse(result.data.cate_sub);
        listCateSub.forEach((cate) => {
          cateSelect.innerHTML += `<option value='${cate.key}'>${cate.value}</option>`;
        });
        if(setValue){
          cateSelect.value = document.querySelector('#get_cateid').value
        }
      }
    });
};
