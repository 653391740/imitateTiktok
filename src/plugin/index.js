import swipper from './swipper/index.js'
import pxUtils from './pxUtils.js'
import Toast from './Toast/index.js'
import popup from './Popup/index.js'

// 插件集合
const plugins = {
  swipper,
  pxUtils,
  Toast,
  popup
}
// 默认导出所有插件
export default plugins

// 单独导出每个插件
export { swipper, pxUtils, Toast, popup }
