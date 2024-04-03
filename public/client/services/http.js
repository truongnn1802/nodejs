import {baseURL} from '../constants/constants.js'
class HTTP {
  constructor(path) {
    this.baseURL = `${path}`;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async fetchJSON(path, options = {}) {
    options = {
      ...options,
      headers: {
        ...this.headers,
        ...(options.headers || {}),
      },
    };

    const response = await fetch(this.baseURL + path, options);

    if (!response.ok) {
      throw new Error("Network request failed");
    }

    return response.json();
  }

  async get(path, options = {}) {
    options.method = "GET";
    return this.fetchJSON(path, options);
  }

  async getQuery(path,data, options = {}) {
    options.method = "GET";
    options.params = JSON.stringify(data);
    return this.fetchJSON(path, options);
  }

  async post(path, data, options = {}) {
    options.method = "POST";
    options.body = JSON.stringify(data);
    return this.fetchJSON(path, options);
  }

  async put(path, data, options = {}) {
    options.method = "PUT";
    options.body = JSON.stringify(data);
    return this.fetchJSON(path, options);
  }

  async delete(path,data, options = {}) {
    console.log(data);
    options.method = "DELETE";
    options.body = JSON.stringify(data);
    return this.fetchJSON(path, options);
  }
}

const http = new HTTP(baseURL)
export default http
