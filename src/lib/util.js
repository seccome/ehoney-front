import { Message } from 'element-ui'
/**
 * 时间格式化
 */

export const formatTime = function(date, mode = 'yyyy-MM-dd hh:mm') {
  if (!date) return ''

  const d0 = new Date(0)
  const d1 = new Date('1970/01/01 08:00:00')
  // eslint-disable-next-line no-param-reassign
  date = parseInt(date) + (d1.getTime() - d0.getTime()) / 1000
  const d = new Date(parseInt(date) * 1000)
  let format = mode
  const o = {
    'M+': d.getMonth() + 1, // month
    'd+': d.getDate(), // day
    'h+': d.getHours(), // hour
    's+': d.getSeconds(), // second
    'm+': d.getMinutes(), // minute
    'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
    S: d.getMilliseconds(), // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${d.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }

  return format
}

/**
 * 获取文件并且转成base64编码
 * @param {Boolean} options.base64File 返回'base64'文件类型
 * @param {Array} options.typeList 限制文件格式
 * @param {Number} options.maxSize 限制文件最大bey
 */
 export function getFile (options = {}) {
  let fileNodeList = [];
  return new Promise((resolve, reject) => {
      let fileNode = document.createElement('input');
      fileNodeList.push(fileNode);
      fileNode.setAttribute('type', 'file');
      if (options.typeList && options.typeList.length) {
          let acceptList = options.typeList.map(type => `.${type}`);
          options.accept = acceptList.join(',');
          fileNode.setAttribute('accept', options.accept);
      }
      
      fileNode.click();
      fileNode.onchange = function (e) {
          let file = e.target.files[0],
              fileName = file.name,
              fileSize = file.size,
              fileType = fileName.split('.').pop();
          // 文件类型校验
          if (options.typeList && !options.typeList.includes(fileType)) {
              Message.error(`只允许上传以下附件类型：${options.accept}`);
              return false;
          }
          // 文件大小校验
          if (options.maxSize < fileSize) {
              let sizeM = (options.maxSize / 1024 / 1024);
              sizeM = sizeM.toFixed(2);
              Message.error(`文件大小，不能大于${sizeM}M`);
              return false;
          }

          // 返回文件
          if (options.base64File) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            fileNode = null;
            reader.onload = function () {
                resolve({
                    fileStr: reader.result,
                    fileName
                }, file);
            }
            reader.onerror = function (err) {
                reject(err);
            }
          } else {
            resolve(file);
          }
      }
  });
}