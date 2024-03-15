document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.querySelector('button[type="submit"]');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const pass = document.getElementById('pass');
    const repass = document.getElementById('repass');
    const phone = document.getElementById('phone');
    const role = document.getElementById('role')
    const date = document.getElementById('date_of_birth')
    const phoneRegex = /^0\d{9}$/;
    btnSubmit.addEventListener('click', (e) => {
        console.log(role.value.trim() === "");
        if (name.value.trim() === "") {
            name.classList.add('required');
            name.placeholder = 'Nhập đủ dữ liệu';
            e.preventDefault();
        } else {
            name.classList.remove('required');
        }

        if (email.value.trim() === "") {
            email.classList.add('required');
            email.placeholder = 'Nhập đủ dữ liệu';
            e.preventDefault();
        } else {
            email.classList.remove('required');
        }

        if (role.value.trim() === "") {
            role.classList.add('required');
            role.placeholder = 'Nhập đủ dữ liệu';
            e.preventDefault();
        } else {
            role.classList.remove('required');
        }
        if (date.value.trim() === "") {
            date.classList.add('required');
            date.placeholder = 'Nhập đủ dữ liệu';
            e.preventDefault();
        } else {
            date.classList.remove('required');
        }

        if (pass.value.trim() === "" || repass.value.trim() === "") {
            pass.classList.add('required');
            repass.classList.add('required');
            pass.placeholder = 'Nhập mật khẩu';
            repass.placeholder = 'Nhập lại mật khẩu';
            e.preventDefault();
        } else if (pass.value !== repass.value) {
            pass.classList.add('required');
            repass.classList.add('required');
            pass.value = '';
            repass.value = '';
            pass.placeholder = 'Mật khẩu không khớp';
            repass.placeholder = 'Mật khẩu không khớp';
            e.preventDefault();
        } else {
            pass.classList.remove('required');
            repass.classList.remove('required');
        }

        const phoneValue = phone.value.trim();
        if (!phoneRegex.test(phoneValue)) {
            phone.classList.add('required');
            phone.placeholder = 'Số điện thoại không hợp lệ';
            e.preventDefault();
        } else {
            phone.classList.remove('required');
        }
    });

})