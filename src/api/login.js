import http from '@/utils/request'
// 登录
export const login = (params) => {
    return http.post('/common/user/loginByPassword', params)
}

// 退出登录
export const logout = (userId) => {
    return http.get(`/user/${userId}/logout`)
}

// 个人信息
export const getUserInfo = (userId) => {
    return http.get(`/user/${userId}/getUserInfo/undefined`)
}

// 获取邮箱验证码
export const getCaptcha = (params) => {
    return http.get(`/common/user/getCode/${params}`)
}
// 注册
export const register = () => {
    return http.post('/common/user/register')
}

// 个人信息修改
export const updateUserInfo = (userId, data) => {
    return http.post(`/user/${userId}/modifyUserInfo`, data)
}