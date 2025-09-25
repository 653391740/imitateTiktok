import axios from "axios";
const service = axios.create({
    baseURL: '/api',
    timeout: 5000,
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
    const { code, data } = res.data
    if (code === 403) {
        localStorage.removeItem('tiktok_userinfo')
        window.location.href = '#/login'
    } else {
        return data;
    }
}, error => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.log('请求超时，请检查网络连接后重试')
    }
    return Promise.reject(error)
});
export default service