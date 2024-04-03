import http from "./http.js";

export const getOrders = async (query, cb) => {
  let params = null;
  if(query){
    params = new URLSearchParams();
  }
  if (query != {}) {
    for (const key in query) {
      if (Object.hasOwnProperty.call(query, key)) {
        params.append(key, query[key]);
      }
    }
  }
  const url = `/orders?${params} `

  try {
    const { data, status } = await http.get(url);
    console.log(data);
    if (status == 200) {
      return data;
    }
  } catch (err) {
    cb(err);
  }
};


export const postOrder = async (data, cb=()=>{}) => {
  try {
    const res = await http.post("/order", data);
    console.log(res);
    return res
  } catch (err) {
    cb(err);
  }
};

export const getPurchase = async (query, cb) => {
    let params = null;
    if(query){
      params = new URLSearchParams();
    }
    if (query != {}) {
      for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
          params.append(key, query[key]);
        }
      }
    }
    const url = `/order?${params} `
  
    try {
      const { data, status } = await http.get(url);
      console.log(data);
      if (status == 200) {
        return data;
      }
    } catch (err) {
      cb(err);
    }
  };