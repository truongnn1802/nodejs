document.addEventListener('DOMContentLoaded', () => {
    handleAddUpdateProduct()
    handleAddUpdateCate()

    const iconDel = document.querySelectorAll('td i:first-child')
    const iconUpdate = document.querySelectorAll('td i:last-child')
    iconDel.forEach(del => {
        del.addEventListener('click', async () => {
            window.location.href =
            `${ window.location.pathname === '/list-product'
                    ? '/delete-product' : '/delete-category'}/`
                    + del.getAttribute('data-id');
        })
    })
    iconUpdate.forEach(edit => {
        edit.addEventListener('click', async () => {
            window.location.href = `${window.location.pathname === '/list-product'
            ?"/update-product" : "/update-category"}/`
             +edit.getAttribute('data-id');
        })
    })
})

const handleAddUpdateProduct = () => {
    const price = document.querySelector('#price')
    const idCate = document.querySelector('#idCate')
    const name = document.querySelector('#name')
    const desc = document.querySelector('#desc')
    const btnSubmit = document.querySelector('button[type="submit"]')
    const imgs = document.querySelector('#imgs')
    const fileImgs = document.querySelector('#file-img')
    if (fileImgs) {
        fileImgs.addEventListener('change', (e) => {
            const files = e.target.files
            imgs.innerHTML = ``
            for (let key in files) {
                console.log(files);
                if (files[Number(key)]) {
                    const url = URL.createObjectURL(files[Number(key)])
                    imgs.innerHTML += `
                        <img src="${url}" style="width:100px"/>
                    `
                }
            }
        })
    }
    if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
            console.log(fileImgs.value);
            if (name.value.trim() == "" && !name.classList.contains("required")) {
                name.classList.add('required')
                name.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()
            } else {
                name.classList.remove('required')
            }
            if (idCate.value.trim() == "" && !idCate.classList.contains("required")) {
                idCate.classList.add('required')
                idCate.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()
            } else {
                idCate.classList.remove('required')
            }
            if (price.value.trim() == "" && !price.classList.contains("required")) {
                price.classList.add('required')
                price.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()
            } else {
                price.classList.remove('required')
            }
            if (desc.value.trim() == "" && !desc.classList.contains("required")) {
                desc.classList.add('required')
                desc.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()

            } else {
                desc.classList.remove('required')
            }
            if (imgs.innerHTML === "") {
                document.querySelector('label[for="file-img"]').style = "color:#fe7c96"
                e.preventDefault()
            } else {
            }
        })
    }
}

const handleAddUpdateCate = () => {
    const name = document.querySelector('#name')
    const desc = document.querySelector('#desc')
    const btnSubmit = document.querySelector('button[type="submit"]')
    if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
            if (name.value.trim() == "" && !name.classList.contains("required")) {
                name.classList.add('required')
                name.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()
            } else {
                name.classList.remove('required')
            }
            if (desc.value.trim() == "" && !desc.classList.contains("required")) {
                desc.classList.add('required')
                desc.placeholder = 'Nhập đủ dữ liệu'
                e.preventDefault()

            } else {
                desc.classList.remove('required')
            }

        })
    }
}