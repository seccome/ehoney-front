export const statusMap = {
  1: { text: '下发中', color: 'grey--text' },
  2: { text: '异常', color: 'red--text' },
  3: { text: '成功', color: 'green--text' }
};

// 服务类型下拉选项
export const ServiceTypeOptions = [
  {text: '探针', value: 'probe'},
  {text: '蜜罐', value: 'honeypot'}
];

// 表达检验规则
export const rules = {
  // pwdReg: /^.*(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%.^&*? ]).*$/,
  pwdReg: /^.*(?=.*\d)(?=.*[a-zA-Z]).*$/,
  pwdRegTip: '密码必须包含字母和数字'
}