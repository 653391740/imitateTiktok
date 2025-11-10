import axios from "axios";

const service = axios.create({
    baseURL: '/api', //http://43.138.15.137:3000/api
    timeout: 10000,
    withCredentials: true,
});

//请求拦截器
service.interceptors.request.use(config => {
    const userinfo = localStorage.getItem('tiktok_userinfo');
    if (userinfo) {
        config.headers['Authorization'] = 'Bearer ' + userinfo.token;
    }
    return config;
}, error => {
    return Promise.reject(error)
});

//响应拦截器
service.interceptors.response.use(res => {
    const { data } = res.data
    return data !== undefined ? data : res.data;
}, error => {
    return Promise.reject(error)
});
export default service