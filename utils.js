/**
* @description 创建元素
* @param {String} eleName 标签名
* @param {Array} classArr 类名数组,为字符串数组
* @param {Object} styleObj 设置样式集合
* @return {DOM} dom 所创建的元素
*/
function createEle(eleName, classArr, styleObj) {
    // 获取dom元素
    var dom = document.createElement(eleName)
    // 添加类名
    for (let i = 0; i < classArr.length; i++) {
        dom.classList.add(classArr[i]);
    }
    // 添加样式
    for (const key in styleObj) {
        dom.style[key] = styleObj[key]
    }
    return dom;
}