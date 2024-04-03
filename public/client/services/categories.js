import http from "./http.js";

export const getAllCate = async (cb) => {
  try {
    const { data, status } = await http.get("/categories");
    if (status == 200) {
      return data;
    }
  } catch (err) {
    cb(err)
  }
};
