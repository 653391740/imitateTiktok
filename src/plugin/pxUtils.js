/**
 * 像素值转换为开发屏幕宽度的比例值
 * @param {number} px 像素值
 * @param {number} designWidth 开发屏幕宽度
 * @returns {number} 转换后的宽度值
 */
const pxUtils = (px, designWidth = 375) => {
    return px / designWidth * window.innerWidth
}
const install = (app) => {
    app.config.globalProperties.$pxUtils = pxUtils
    app.provide('pxpxUtils', pxUtils)
}
export default install