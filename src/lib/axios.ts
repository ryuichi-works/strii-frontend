import Axios from "axios";

const axios = Axios.create({
  baseURL: 'http://localhost',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  xsrfCookieName: 'XSRF-TOKEN',
  withCredentials: true,
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/json',
  }
})

export default axios;
