import Axios from "axios";

const axios = Axios.create({
  // baseURL: 'http://localhost',
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  xsrfHeaderName: 'X-XSRF-TOKEN',
  xsrfCookieName: 'XSRF-TOKEN',
  withCredentials: true,
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    'content-type': 'application/json',
  }
})

export default axios;
