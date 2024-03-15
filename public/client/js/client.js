document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelectorAll('.product__item')
    document.body.addEventListener('change', function (e) {
        console.log(e.target.value);
        const qrMomo = document.querySelector('#qr-momo')
        if (e.target.value === 'momo') {
            qrMomo.innerHTML = `<img src='/client/asset/img/shop-cart/qrcode.png' alt="qr-code" style="width:100px"/>`
        } else if (e.target.value === 'cash') {
            qrMomo.innerHTML = ''
        }
    });

    products.forEach(product=>{
        product.addEventListener('click',()=>{
            window.location.href='/client/shop/111'
        })
    })
})
