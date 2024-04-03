function generateUUID() {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charArr = chars.split("");
  const uuidArr = [];

  for (let i = 0; i < 32; i++) {
    switch (i) {
      case 8:
      case 13:
      case 18:
      case 23:
        uuidArr.push("-");
        break;
      case 14:
        uuidArr.push("4");
        break;
      case 19:
        uuidArr.push(charArr[Math.floor(Math.random() * 4) + 8]);
        break;
      default:
        uuidArr.push(charArr[Math.floor(Math.random() * 62)]);
    }
  }

  return uuidArr.join("");
};
// Sử dụng hàm để tạo UUID ngẫu nhiên
module.exports = generateUUID
 // In ra chuỗi UUID ngẫu nhiên
