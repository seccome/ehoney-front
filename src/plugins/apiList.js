import env from '@/env.config.js'
const envData = env[window.__env__ || 'default'];

let apiUrlList = {
  resetPwd: '/user/password', // 修改密码 

  trafficAttackSearch: '/attack', // 流量攻击 - 查询

  falcoEventSearch: '/attack/falco', // FALCO事件 - 查询 - 详情

  tokenTracktSearch: '/attack/token', // 密签跟踪 - 查询 
  
  traceSourceSearch: '/attack/trace', // 溯源 - 查询 

  honeypotSearch: '/honeypot/set', // 蜜罐 - 查询
  honeypotCreate: '/honeypot', // 蜜罐 - 新增、删除
  getImagesPod: '/images/pod', // 获得POD镜像列表
  tokenHoneypotSearch: '/token/honeypot/set', // 蜜罐密签 - 查询
  tokenHoneypotCreate: '/token/honeypot', // 蜜罐密签 - 新增、删除
  getTokenNameOptions: '/token/name/set', // 密签名称列表查询
  baitHoneypotSearch: '/bait/honeypot/set', // 蜜罐诱饵 - 查询
  baitHoneypotCreate: '/bait/honeypot', // 蜜罐诱饵 - 新增、删除

  signSearch: '/token/set', // 密签 - 查询
  signCreate: '/token', // 密签 - 创建、删除、下载
  getSignType: '/token/type', // 查询支持密签类型
  trapSearch: '/bait/set', // 诱饵 - 查询
  trapCreate: '/bait', // 诱饵 - 创建、删除、下载
  getTrapType: '/bait/type', // 查询支持诱饵类型

  imageListSearch: '/images/set', // 镜像列表 - 查询
  imageListCreate: '/images', // 镜像列表 - 更新
  getProtocolType: '/protocol/type', // 镜像列表 - 查询镜像类型

  probeListSearch: '/probe/set', // 探针列表 - 查询
  baitProbeSearch: '/bait/probe/set', // 探针诱饵 - 查询
  baitProbeCreate: '/bait/probe', // 探针诱饵 - 创建、删除
  tokenProbeSearch: '/token/probe/set', // 探针密签 - 查询
  tokenProbeCreate: '/token/probe', // 探针密签 - 创建、删除

  protocolTypeSearch: '/protocol/set', // 协议类型 - 查询
  protocolTypeCreate: '/protocol', // 协议类型 - 创建、删除
  protocolProxySearch: '/proxy/protocol/set', // 协议代理 - 查询
  protocolProxyCreate: '/proxy/protocol', // 协议代理 - 创建、删除
  protocolTypePort: '/protocol/port', // 协议代理 - 修改端口
  transparentProxySearch: '/proxy/transparent/set', // 协议转发 - 查询
  transparentProxyCreate: '/proxy/transparent', // 协议转发 - 创建、删除
  protocolProxyOnline: '/proxy/protocol/online', // 协议代理 - 上线
  protocolProxyOffline: '/proxy/protocol/offline', // 协议代理 - 下线
  protocolProxyProbe: '/proxy/protocol/test', // 协议代理 - 探测
  transparentProxyOnline: '/proxy/transparent/online', // 协议转发 - 上线
  transparentProxyOffline: '/proxy/transparent/offline', // 协议转发 - 下线
  transparentProxyProbe: '/proxy/transparent/test', // 协议转发 - 探测

  systemWebhook: '/webhook', // 钉钉webhook - 设置和获取
  systemTokenTrace: '/token/trace', // 密签跟踪URL - 设置和获取
  systemHarbor: '/harbor', // harbor镜像源 - 设置和获取

  agentLinuxDownLoad: '/agent/linux', // 下载linux Agent
  agentWindowsDownLoad: '/agent/windows', // 下载windows Agent

  attackIpSearch: '/attack/display/attackIP', // 攻击ip统计
  attackLocationSearch: '/attack/display/location', // 攻击位置统计
  attackProbeIPSearch: '/attack/display/probeIP', // 攻击业务ip统计
  attackProtocolSearch: '/attack/display/protocol', // 攻击服务类型统计

};

let publicUrlList = {
  login: '/login', // 登录
  register: '/signup', // 注册 
};


Object.keys(apiUrlList).forEach(key => {
  apiUrlList[key] = envData.VUE_APP_API_URL + apiUrlList[key];
});
Object.keys(publicUrlList).forEach(key => {
  publicUrlList[key] = envData.VUE_APP_PUBLIC_URL + publicUrlList[key];
});

export default Object.assign(apiUrlList, publicUrlList);
