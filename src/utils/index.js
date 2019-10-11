/* eslint-disable no-extend-native */
export function init() {
  // Warn if overriding existing method
  if (Array.prototype.equals)
    console.warn(
      "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
    )
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array) return false
    // compare lengths - can save a lot of time
    if (this.length !== array.length) return false
    for (let i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false
      } else if (this[i] !== array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false
      }
    }
    return true
  }
  String.prototype.endWith = function(endStr) {
    const d = this.length - endStr.length
    return d >= 0 && this.lastIndexOf(endStr) === d
  }
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, 'equals', { enumerable: false })

  Date.prototype.format = function(fmt) {
    const o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
      }
    }
    return fmt
  }
}

export function getParams(key) {
  if (window.location.href.indexOf('?') !== -1) {
    const str = window.location.href.split('?')[1]
    if (str.indexOf('&') !== -1) {
      const arr = str.split('&')
      let output = ''
      arr.forEach(item => {
        const ar = item.split('=')
        if (ar[0] === key) {
          output = ar[1]
        }
      })
      return output
    }
    const arr = str.split('=')
    if (key === arr[0]) {
      return arr[1]
    }
  }
}

const getResult = function(list) {
  list.forEach(function(item) {
    if (item.childRoutes && item.childRoutes.length) {
      // eslint-disable-next-line array-callback-return
      item.childRoutes.map((it, ind) => {
        it.path = item.path + it.path
        if (it.childRoutes && it.childRoutes.length) {
          getResult(item.childRoutes)
        }
      })
    }
  })
}

export function handleRoute(routeConfig) {
  var copy = routeConfig
  getResult(routeConfig)
  return copy
}

export function getNowFormatDate() {
  const date = new Date()
  const seperator1 = '-'
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = `0${month}`
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`
  }
  const currentdate = year + seperator1 + month + seperator1 + strDate
  return currentdate
}

export function FirstLastChange(arr) {
  const last = arr.pop()
  arr.unshift(last)
  return JSON.parse(JSON.stringify(arr))
}
