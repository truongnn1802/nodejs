const mysql = require("mysql");

const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3307,
  // database:'assignment'
});
connect.connect((err) => {
  if (err) {
    console.log("lỗi");
  }
  connect.query(`CREATE DATABASE IF NOT EXISTS assignment`, (err, res) => {
    if (res) {
    }
    connect.query("USE assignment", (err, result) => {
      if (err) {
        console.error("Lỗi khi sử dụng cơ sở dữ liệu:", err);
        return;
      }
      connect.query(
        `       CREATE TABLE IF NOT EXISTS account (
                    id VARCHAR(32) PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL,
                    phone VARCHAR(20),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    avatar VARCHAR(255)
                )`,
        () => {}
      );
      connect.query(
        `      CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(32) PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                description TEXT,
                cate_sub TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )`,

        () => {}
      );
      connect.query(
        `      CREATE TABLE IF NOT EXISTS products (
                    id VARCHAR(32) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price DECIMAL(10, 2) NOT NULL,
                    description TEXT,
                    image_url TEXT,
                    category_id VARCHAR(50),
                    cate_sub VARCHAR(32),
                    sale DECIMAL(2, 2) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id)
                )`,
        () => {}
      );
      connect.query(
        `      CREATE TABLE IF NOT EXISTS product_variant (
                id VARCHAR(32) PRIMARY KEY,
                product_id VARCHAR(32),
                type TEXT,
                color VARCHAR(50),
                FOREIGN KEY (product_id) REFERENCES products(id)
                )`,
        () => {}
      );
      connect.query(
        `ALTER TABLE products
              ADD COLUMN sub_cate VARCHAR(50),
            `,
        () => {}
      );
      connect.query(
        `CREATE TABLE IF NOT EXISTS favorites (
          id VARCHAR(32) PRIMARY KEY,
          user_id VARCHAR(32) NOT NULL,
          item_id VARCHAR(32) NOT NULL,
          size VARCHAR(5),
          color VARCHAR(7),
          quantity INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES account(id),
          FOREIGN KEY (item_id) REFERENCES products(id)
      );
            `,
        () => {}
      );
      connect.query(
        `CREATE TABLE IF NOT EXISTS feedback (
          id VARCHAR(32) PRIMARY KEY,
          user_id VARCHAR(32) NOT NULL,
          product_id VARCHAR(32) NOT NULL,
          name VARCHAR(32),
          content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES account(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
      );
      `,
        () => {}
      );
      connect.query(
        `CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(32) PRIMARY KEY,
          user_id VARCHAR(32) NOT NULL,
          name VARCHAR(32),
          address TEXT NOT NULL,
          phone VARCHAR(10),
          note TEXT,
          email VARCHAR(32),
          status INT DEFAULT 0,
          payment INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES account(id)
      );
      `,
        () => {}
      );connect.query(
        `CREATE TABLE IF NOT EXISTS order_detail (
          id VARCHAR(32) PRIMARY KEY,
          order_id VARCHAR(32) NOT NULL,
          product_id VARCHAR(32) NOT NULL,
          size VARCHAR(5),
          color VARCHAR(7),
          quantity INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
      );
      `,
        () => {}
      );

    });
  });
});

module.exports = connect;
