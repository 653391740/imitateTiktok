import axios from "axios";
import { Toast } from '@/plugin/index';

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
    const { code, message } = error.response.data
    if (code === 'auth:not logged in') {
        import('@/stores/counter').then(({ loginStore }) => {
            const LoginStore = loginStore()
            LoginStore.logout()
            Toast.show('登录状态已失效，请重新登录')
        })
    }
    if (code === 'ECONNABORTED' && message.includes('timeout')) Toast.show('请求超时，请检查网络连接后重试')

    return Promise.reject(error.response.data)
});
export default service