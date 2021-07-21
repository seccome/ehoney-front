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
