import http from "./http.js";

export const getFavorite = async (query, cb) => {
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
  const url = `/favorites?${params} `

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


export const postFavorites = async (data, cb=()=>{}) => {
  const body = {
    ...data,
    size:data?.size || null,
    color:data?.color || null,
    quantity:data?.quantity || 0,
  }
  try {
    const res = await http.post("/favorite", body);
    console.log(res);
    return res
  } catch (err) {
    cb(err);
  }
};

export const updateFavorites = async (data, cb=()=>{}) => {
  const body = {
    ...data,
    size:data?.size || null,
    color:data?.color || null,
    quantity:data?.quantity || 0,
  }
  try {
    const res = await http.put("/favorite", body);
    return res
  } catch (err) {
    cb(err);
  }
};

export const deleteFavorites = async (id, cb) => {
  console.log(id);
  try {
    const { status } = await http.delete("/favorite", { id });
    if (status) {
      return status;
    } else {
    }
  } catch (err) {
    cb(err);
  }
};
