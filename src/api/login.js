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
export const getCode = (email) => {
    return http.get(`/common/user/getCode/${email}`)
}
// 注册
export const register = (data) => {
    return http.post('/common/user/register', data)
}

// 个人信息修改
export const updateUserInfo = (userId, data) => {
    return http.post(`/user/${userId}/modifyUserInfo`, data)
}

// 找回密码
export const findPassword = (email) => {
    return http.get(`/common/user/detectEmail/${email}`)
}

/**
 * 重置密码
 * @param {object} data 包含邮箱、验证码、新密码的对象
 * @param {string} data.email 邮箱
 * @param {string} data.code 验证码
 * @param {string} data.password 新密码
 * @returns 
 */
export const resetPassword = (data) => {
    return http.post('/common/user/retrievePassword', data)
}   