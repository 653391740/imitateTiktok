import axios from "axios";
import { Toast } from '@/plugin/Toast/index.js';

const service = axios.create({
    baseURL: '/api',
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