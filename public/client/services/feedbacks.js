import http from "./http.js";

export const getFeedback = async (query, cb) => {
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
  console.log(query);
  const url = `/feedbacks?${params} `
  try {
    const { data, status } = await http.get(url);
    if (status == 200) {
      return data;
    }
  } catch (err) {
    cb(err);
  }
};


export const postFavorites = async (body, cb) => {
  try {
    const res = await http.post("/feedback", body);
    return res
  } catch (err) {
    cb(err);
  }
};

export const deleteFavorites = async (id, cb) => {
  console.log(id);
  try {
    const { status } = await http.delete("/feedback", { id });
    if (status) {
      return status;
    } else {
    }
  } catch (err) {
    cb(err);
  }
};
