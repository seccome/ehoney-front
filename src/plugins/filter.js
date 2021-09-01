// 数组拼接成字符串
let arrayToStrFilter = (value, key, spot = '，') => {
  if (Array.isArray(value)) {
      if (key) {
          return value.map(item => item[key]).join(spot);
      } else {
          return value.join(spot);
      }
  } else {
      return '';
  }
}
// [{text:'文本', value: '值'}] 数组里面的成员是对象，根据value取值text
let getArrayVal = (value, arr, key = 'text', val = 'value') => {
  let str = '';
  for (let i = 0, len = arr.length; i < len; i++) {
      if (value === arr[i][val]) {
          str = arr[i][key];
          break;
      }
  }
  return str;
}