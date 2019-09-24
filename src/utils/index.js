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

// //递归遍历实现
// var recursiveFunction = function() {
//   var str = ''
//   const getStr = function(list) {
//     list.forEach(function(row) {
//       if (row.children) {
//         getStr(row.children)
//       } else {
//         str += row.name + ';'
//       }
//     })
//   }
//   getStr(data)
//   console.log(str)
// }
// recursiveFunction()
const getResult = function(list) {
  list.forEach(function(item) {
    if (item.childRoutes && item.childRoutes.length) {
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
  // console.log(copy)
  return copy
}
