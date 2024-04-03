const fs = require("fs");
const path = require("path");

const filePath = path.join(process.cwd(), "global_value.txt");

// Lưu trữ giá trị vào tệp tin
function saveFile(value) {
  fs.writeFileSync(filePath, value);
}

// Đọc giá trị từ tệp tin
function getFile() {
    if (!fs.existsSync(filePath)) {
        // Nếu tệp tin không tồn tại, tạo file mới và trả về giá trị mặc định
        fs.writeFileSync(filePath, ''); // Tạo file với nội dung rỗng
        return ""; // Trả về giá trị mặc định
      }
  return fs.readFileSync(filePath, "utf8");
}

// Sử dụng các hàm này khi cần lưu trữ và đọc giá trị của biến toàn cục
module.exports = { saveFile, getFile };
