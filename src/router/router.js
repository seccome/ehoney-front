import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/Base'
import SubLayout from '@/components/layout/SubLayout';

import Login from '@/views/login/login';
import trafficAttack from '../views/threatenPerception/trafficAttack'; // 流量攻击
import falcoEvent from '../views/threatenPerception/falcoEvent'; // FALCO事件
import tokenTrack from '../views/threatenPerception/tokenTrack'; // 密签跟踪
import traceSource from '../views/threatenPerception/traceSource'; // 溯源
import HoneypotList from '@/views/honeypot-manage/HoneypotList'; // 蜜罐列表
import HoneypotTopo from '@/views/honeypot-manage/HoneypotTopo'; // 蜜罐拓扑
import signList from '@/views/trapManage/signList'; // 密签管理
import trapList from '@/views/trapManage/trapList'; // 诱饵管理
import imageList from '@/views/imageList'; // 镜像列表
import probesList from '@/views/probesList'; // 探针列表
import protocolProxy from '@/views/shadowProxy/protocolProxy'; // 协议转发
import protocolType from '@/views/shadowProxy/protocolType'; // 协议类型
import protocolTransparent from '@/views/shadowProxy/protocolTransparent'; // 透明转发
import systemConfig from '@/views/systemConfig'; // 系统设置
import DownLoad from '@/views/download' // 下载支持
import DataV from '@/views/datav/DataV' // 大屏展示


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  base: 'decept-defense',
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Base',
      component: Layout,
      redirect: '/threaten-perception',
      children: [
        {
          path: '/threaten-perception',
          name: 'threatenPerception',
          component: SubLayout,
          redirect: '/threaten-perception/traffic-attack',
          meta: { title: '威胁感知' },
          children: [
            {
              path: 'traffic-attack',
              name: 'trafficAttack',
              meta: { title: '攻击事件' },
              component: trafficAttack
            },
            {
              path: 'falco-event',
              name: 'falcoEvent',
              meta: { title: 'Falco事件' },
              component: falcoEvent
            },
            {
              path: 'token-track',
              name: 'tokenTrack',
              meta: { title: '密签事件' },
              component: tokenTrack
            },
            {
              path: 'trace-source',
              name: 'traceSource',
              meta: { title: '溯源' },
              component: traceSource
            },
            {
              path: 'honeypot-topo',
              name: 'HoneypotTopo',
              meta: { title: '节点拓扑' },
              component: HoneypotTopo,
            },
          ]
        },
        {
          path: 'honeypots',
          name: 'honeypotList',
          meta: { title: '密罐管理' },
          component: HoneypotList
        },
        {
          path: '/probes-list',
          name: 'probesList',
          meta: { title: '探针管理' },
          component: probesList
        },
        {
          path: 'proxy-manage',
          name: 'proxyManage',
          meta: { title: '代理管理' },
          component: SubLayout,
          redirect: '/proxy-manage/protocol-forwarding',
          children: [
            {
              path: 'protocol-forwarding',
              name: 'protocol-forwarding',
              meta: { title: '协议转发' },
              component: protocolProxy,
            },
            {
              path: 'protocol-transparent',
              name: 'protocolTransparent',
              meta: { title: '透明转发' },
              component: protocolTransparent,
            },
          ]
        },
        {
          path: '/trap-manage',
          name: 'TrapManage',
          component: SubLayout,
          redirect: '/trap-manage/sign',
          meta: { title: '诱捕管理' },
          children: [
            {
              path: 'token',
              name: 'sign',
              meta: { title: '密签管理' },
              component: signList
            },
            {
              path: 'trap',
              name: 'trap',
              meta: { title: '诱饵管理' },
              component: trapList
            },
            {
              path: 'protocol-type',
              name: 'protocolType',
              meta: { title: '协议类型' },
              component: protocolType,
            },
            {
              path: 'image-list',
              name: 'imageList',
              meta: { title: '镜像列表' },
              component: imageList
            },
          ]
        },
        {
          path: '/system-config',
          name: 'systemConfig',
          meta: { title: '系统设置' },
          component: systemConfig
        },
        {
          path: '/download',
          name: 'Download',
          component: DownLoad,
          meta: { title: '下载支持' },
        },
      ]
    },

    {
      path: '/datav',
      name: 'DataV',
      component: DataV
    },
    
  ],
})

export default router
