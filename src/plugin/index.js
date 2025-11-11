import swipper from './swipper/index.js'
import pxUtils from './pxUtils.js'
import Toast from './Toast/index.js'
import popup from './Popup/index.js'
import Pullupload from './Pullupload/index.js'
import filters from './filters.js'
import Dialog from './Dialog/index.js'
import directives from './directives.js'

// 插件集合
const plugins = {
  swipper,
  pxUtils,
  Toast,
  popup,
  Pullupload,
  Dialog,
  filters,
  directives
}
// 默认导出所有插件
export default plugins

// 单独导出每个插件
export { swipper, pxUtils, Toast, popup, Pullupload, Dialog, filters, directives }
