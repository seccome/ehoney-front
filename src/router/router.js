import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Base'
import SubLayout from '@/components/layout/SubLayout'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  base: 'decept-defense',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Base',
      redirect: '/honeypot-manage',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/login'),
    },
    {
      path: '/honeypot-manage',
      name: 'HoneypotManage',
      component: Layout,
      redirect: '/honeypot-manage/honeypots',
      meta: { title: '蜜罐管理' },
      children: [
        {
          path: 'honeypots',
          name: 'HoneypotList',
          meta: { title: '蜜罐列表' },
          component: SubLayout,
          redirect: '/honeypot-manage/honeypots',
          children: [
            { path: '', component: () => import('../views/honeypot-manage/HoneypotList') },
            {
              path: 'create',
              name: 'HoneypotCreate',
              meta: { title: '新建蜜罐' },
              component: () => import('../views/honeypot-manage/HoneypotCreate'),
            },
            {
              path: 'honeypots/:honeypotId/decoys',
              name: 'BaitList',
              meta: { title: '诱饵列表' },
              component: () => import('../views/honeypot-manage/BaitList'),
            },
            {
              path: 'honeypots/:honeypotId',
              name: 'SignatureList',
              meta: { title: '密签列表' },
              component: SubLayout,
              redirect: 'honeypots/:honeypotId/signatures',
              children: [
                {
                  path: 'signatures',
                  component: () => import('../views/honeypot-manage/SignatureList'),
                },
                {
                  path: 'signatures/:trackDetailId',
                  name: 'SignTrackDetail',
                  meta: { title: '密签跟踪详情' },
                  component: () => import('../modules/track-detail/TrackDetailWrapper'),
                  redirect: 'signatures/:trackDetailId/list',
                  children: [
                    {
                      path: 'list',
                      component: () => import('../modules/track-detail/SignTrackDetail'),
                    },
                    {
                      path: 'path',
                      component: () => import('../modules/track-detail/SignTrackPath'),
                    },
                  ],
                },
              ],
            },
          ]
        },
        {
          path: 'honeypot-topo',
          name: 'HoneypotTopo',
          meta: { title: '蜜罐拓扑' },
          component: () => import('../views/honeypot-manage/HoneypotTopo'),
        },
      ],
    },
    {
      path: '/trap-manage',
      name: 'TrapManage',
      component: Layout,
      redirect: '/trap-manage/probes',
      meta: { title: '诱捕管理' },
      children: [
        {
          path: 'probes',
          name: 'Probes',
          meta: { title: '探针列表' },
          component: SubLayout,
          redirect: '/trap-manage/probes',
          children: [
            { path: '', component: () => import('../views/trap-manage/Probes/ProbeList')},
            {
              path: '/probes/:agentId',
              name: 'ProbesSignatures',
              redirect: '/probes/:agentId/signatures',
              meta: { title: '密签列表' },
              component: SubLayout,
              children: [
                {
                  path: 'signatures',
                  component: () => import('../views/trap-manage/Probes/SignaturesDetail'),
                },
                {
                  path: 'signatures/:signTrackDetailId',
                  name: 'ProbesSignTrackDetail',
                  meta: { title: '密签跟踪详情' },
                  component: () => import('../modules/track-detail/TrackDetailWrapper'),
                  redirect: 'signatures/:signTrackDetailId/list',
                  children: [
                    {
                      path: 'list',
                      component: () => import('../modules/track-detail/SignTrackDetail'),
                    },
                    {
                      path: 'path',
                      component: () => import('../modules/track-detail/SignTrackPath'),
                    },
                  ],
                },
              ],
            },
            {
              path: 'probes/:agentId/decoys',
              name: 'ProbesDecoys',
              meta: { title: '诱饵列表' },
              component: () => import('../views/trap-manage/Probes/DecoyList'),
            },
          ]
        },
        {
          path: 'custom-signature',
          name: 'CustomSignature',
          meta: { title: '自定义密签' },
          component: () => import('../views/trap-manage/CustomSignature'),
        },
        {
          path: 'custom-decoy',
          name: 'CustomDecoy',
          meta: { title: '自定义诱饵' },
          component: () => import('../views/trap-manage/CustomDecoy'),
        },
      ],
    },
    {
      path: '/trojans-detection',
      name: 'Honeypot',
      component: Layout,
      redirect: '/trojans-detection/trojans',
      meta: { title: '木马检测' },
      children: [
        {
          path: 'trojans',
          name: 'Trojans',
          meta: { title: '木马列表' },
          component: () => import('../views/trojans-detection/Trojans'),
        },
      ],
    },
    {
      path: '/shadow-agency',
      name: 'ShadowAgency',
      component: Layout,
      redirect: '/shadow-agency/protocol-forwarding',
      meta: { title: '影子代理' },
      children: [
        {
          path: 'protocol-forwarding',
          name: 'protocol-forwarding',
          meta: { title: '协议转发' },
          component: () => import('../views/shadow-agency/ProtocolForwarding'),
        },
        {
          path: 'transparent-forwarding',
          name: 'transparent-forwarding',
          meta: { title: '透明转发' },
          component: () => import('../views/shadow-agency/TransparentForwarding'),
        },
      ],
    },
    {
      path: '/alarm-manage',
      name: 'AlarmManage',
      component: Layout,
      redirect: '/alarm-manage/alarms',
      meta: { title: '告警管理' },
      children: [
        {
          path: 'alarms',
          name: 'Alarms',
          redirect: '/alarm-manage/alarms',
          meta: { title: '告警列表' },
          component: SubLayout,
          children: [
            {
              path: '',
              component: () => import('../views/alarm-manage/Alarms'),
            },
            {
              path: 'alarms/:id',
              name: 'AlarmDetails',
              component: () => import('../views/alarm-manage/AlarmDetails'),
              meta: { title: '事件详情' },
            },
          ],
        },
        {
          path: 'attack-tracing',
          name: 'AttackTracing',
          meta: { title: '攻击溯源' },
          component: () => import('../views/alarm-manage/AttackTracing'),
        },
      ],
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Layout,
      redirect: '/settings/alarm',
      meta: { title: '系统设置' },
      children: [
        {
          path: 'alarm',
          name: 'AlarmSetting',
          meta: { title: '告警配置' },
          component: () => import('../views/setting/AlarmSetting'),
        },
        {
          path: 'mirror',
          name: 'MirrorSetting',
          meta: { title: '镜像配置' },
          component: () => import('../views/setting/MirrorSetting'),
        },
        {
          path: 'treaty',
          name: 'TreatySetting',
          meta: { title: '协议配置' },
          component: () => import('../views/setting/TreatySetting'),
        },
        {
          path: 'mirrors',
          name: 'Mirrors',
          meta: { title: '镜像列表' },
          component: () => import('../views/setting/MirrorList'),
        },
        {
          path: 'redisSetting',
          name: 'RedisSetting',
          meta: { title: 'redis配置' },
          component: () => import('../views/setting/RedisSetting'),
        },
        {
          path: 'trackingUrl',
          name: 'trackingUrl',
          meta: { title: '密签追踪url配置' },
          component: () => import('../views/setting/trackingUrlSetting'),
        },
      ],
    },
    {
      path: '/datav',
      name: 'DataV',
      component: () => import('../views/datav/DataV'),
    },
    {
      path: '/download',
      name: 'Download',
      component: () => import('../views/download/index'),
      meta: { title: '下载支持' },
      children: [{
        path: '',
        component: () => import('../views/download/download'),
      }]
    },
  ],
})

export default router
