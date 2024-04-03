import http from "./http.js";

export const getAllProducts = async (cb) => {
  try {
    const { data, status } = await http.get("/products");
    if (status == 200) {
      return data;
    }
  } catch (err) {
    cb(err);
  }
};

export const getQuery = async (query, cb) => {
  let params = null;
  if (query && Object.keys(query).length > 0) {
    params = new URLSearchParams();
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        params.append(key, query[key]);
      }
    }
  }

  const url =
    query && Object.keys(query).length > 0 ? `/product?${params}` : "/products";
  try {
    const { data, status, total } = await http.get(url);
    if (status == 200) {
      return { data, status, total };
    }
  } catch (err) {
    cb(err);
  }
};

export const getDetail = async (id, cb) => {
  const url = `/product/${id}`;
  try {
    const { data, status } = await http.get(url);
    if (status == 200) {
      return { data, status };
    }
  } catch (err) {
    cb(err);
  }
};

export const updateProductVariant = async (body, cb = () => {}) => {
  const url = `/product-variant`;
  try {
    const res = await http.put(url, body);
    if (res.status == 200) {
      return res;
    }
  } catch (err) {
    cb(err);
  }
};
