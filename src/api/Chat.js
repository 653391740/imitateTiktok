import http from '@/utils/request'

export const getPrivateLetter = (userId, formId) => {
    return http.get(`/user/${userId}/getPrivateLetter/${formId}`)
}

export const readPrivateLetter = (userId, formId) => {
    return http.get(`/user/${userId}/readPrivateLetter/${formId}`)
}

export const sendPrivateLetter = (userId, formId, data) => {
    return http.post(`/user/${userId}/privateLetter/${formId}`, data)
}