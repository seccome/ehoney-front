const res = {
  /**
   * @type：number
   * @des：0-表示成功，401-表示登陆失效，剩下的是错误后端自定义（post 的错误貌似是502，后续再确定也行）
   */
  "code": 0,
  
  
  /**
   * @type：string
   * @des：后端返回的 信息，
   */
  "message": "成功",
  
  /**
   * @type：object
   * @des：data 里面就是数据
   */
  "data": {"test": false}
}
