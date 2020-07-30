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

/**
* @description 存、取数据
*/
function setLocal(key, value) {
    // 若value为Object类型，则进行转换
    if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value);
}

function getLocal(key) {
    var value = localStorage.getItem(key);
    if (value === null) {
        return value
    };
    // 当value为一个数组或对象
    if (value[0] === '[' || value[0] === '{') {
        return JSON.parse(value)
    }
    return value
}

// 对时间格式化，若为个位数，则前面添0
function formatNum(num) {
    if (num < 10) {
        return '0' + num
    }
    return num;
}