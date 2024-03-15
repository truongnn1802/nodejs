const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const app = express()


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs')

const port = process.env.PORT || 3000

// Định nghĩa nơi lưu trữ ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // Thư mục 'uploads/' sẽ chứa ảnh được tải lên
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Math.random(Date.now()) + path.extname(file.originalname))
  }
});

// Khởi tạo bộ tải lên
const upload = multer({ storage }).array('img', 10);

let dataProducts = []
let dataCates = []
let dataUser = []


app.get('/', (req, res) => {
  res.render('pages/login')
})

app.post('/login', (req, res) => {
  const { name, pass } = req.body;

  const user = dataUser.filter(user => user.name == name.trim())?.[0]
  if (user && user?.pass == pass) {
    user.role === 'admin' ? res.redirect('/list-product') : res.redirect('/client')
  } else {
    res.redirect('/')
  }
})

app.get('/register', (req, res) => {
  res.render('pages/register')
})

app.post('/sign-up', (req, res) => {
  const { name, role, email, date_of_birth, phone, pass } = req.body;
  user = {
    id: Math.random(Date.now()),
    name: name.trim(),
    role: role.trim(),
    email: email.trim(),
    date_of_birth: date_of_birth.trim(),
    phone: phone.trim(),
    pass: pass.trim(),
  }
  dataUser.push(user)
  res.redirect('/')
})
/*-----------------------------------Admin--------------------------------*/
app.get('/list-product', (req, res) => {
  res.render('admin/pages/list-product', { products: dataProducts })
})

app.get('/add-product', (req, res) => {
  res.render('admin/pages/add-product',{cates:dataCates})
})

app.get('/delete-product/:id', (req, res) => {
  const productId = req.params.id;
  dataProducts = dataProducts.filter(product => product.id != productId);
  res.redirect('/list-product');
})

app.get('/update-product/:id', (req, res) => {
  const data = dataProducts.filter(product => product.id == req.params.id);
  res.render('admin/pages/update-product', { data: data?.[0] })
})

app.post('/update-product', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Xử lý lỗi từ multer
      return res.status(500).json(err);
    } else if (err) {
      // Xử lý lỗi khác
      return res.status(500).json(err);
    }
    const name = req.body.name.trim()
    const id = req.body.id
    const idCate = req.body.idCate.trim()
    const desc = req.body.desc.trim()
    const price = req.body.price.trim()
    const countImg = req.files.length

    if (name != "" && idCate != "" && desc != "" && price != "") {
      dataProducts = dataProducts.map(product => {
        let obj = {}
        if (product.id == id) {
          obj = {
            ...product,
            name, idCate, desc, price,
            imgs: countImg > 0 ? req.files.map(file => file.filename) : product.imgs
          }
        } else {
          obj = product
        }
        return obj
      })
      res.redirect('/list-product')
    } else {
    }
  });

})

app.post('/create-product', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Xử lý lỗi từ multer
      return res.status(500).json(err);
    } else if (err) {
      // Xử lý lỗi khác
      return res.status(500).json(err);
    }
    const name = req.body.name.trim()
    const idCate = req.body.idCate.trim()
    const desc = req.body.desc.trim()
    const price = req.body.price.trim()
    console.log(idCate);

    if (name != "" && idCate != "" && desc != "" && price != "" && req.files.length > 0) {
      product = {
        id: Math.random(Date.now()),
        name, idCate, desc, price,
        imgs: req.files.map(file => file.filename)
      }
      dataProducts.push(product)
      res.redirect('/add-product')
    } else {
    }
  });

})

/*------------------------------------------------------------------*/

app.get('/list-category', (req, res) => {
  res.render('admin/pages/list-category', { cates: dataCates })
})

app.get('/add-category', (req, res) => {
  res.render('admin/pages/add-category')
})

app.get('/update-category/:id', (req, res) => {
  const data = dataCates.filter(cate => cate.id == req.params.id);
  res.render('admin/pages/update-category', { data: data?.[0] })
})

app.get('/delete-category/:id', (req, res) => {
  const id = req.params.id;
  dataCates = dataCates.filter(cate => cate.id != id);
  res.redirect('/list-category');
})

app.post('/update-category', (req, res) => {

  const name = req.body.name.trim()
  const id = req.body.id
  const desc = req.body.desc.trim()
  if (name != "" && desc != "") {

    dataCates = dataCates.map(cate => {
      if (cate.id == id) {
        return {
          ...cate,
          name,
          desc,
          date_up: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }
      } else {
        return cate
      }
    })
    res.redirect('/list-category')
  } else {
  }
});

app.post('/create-category', (req, res) => {
  const name = req.body.name.trim()
  const desc = req.body.desc.trim()
  if (name != "" && desc != "") {
    let cate = {
      id: Math.random(Date.now()),
      name,
      desc,
      count: 0,
      date_cre: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      date_up: null
    }
    dataCates.push(cate)
    res.redirect('/add-category')
  } else {
  }
});

/*------------------------------------------------------------------*/

app.get('/list-user', (req, res) => {
  res.render('admin/pages/list-user', { users: dataUser.filter(user=>user.role == "client") })
})

/*------------------------------------Client-------------------------*/
app.get('/client', (req, res) => {
  res.render('client/pages/home')
})
app.get('/client/shop', (req, res) => {
  res.render('client/pages/shop')
})
app.get('/client/shop/:id', (req, res) => {
  res.render('client/pages/product-detail')
})
app.get('/client/shop-cart', (req, res) => {
  res.render('client/pages/shop-cart')
})
app.get('/client/checkout', (req, res) => {
  res.render('client/pages/checkout')
})


app.listen(port, () => {
  console.log("Serve run on http://localhost:" + 3000);
})