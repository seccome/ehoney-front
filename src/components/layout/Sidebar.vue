<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="menu">
      <el-menu
        :default-active="defaultActive"
        unique-opened
        ref="menu"
        router>
        <template v-for="menu in menus">
          <el-menu-item
            v-if="!menu.children || !menu.children.length"
            :key="menu.path"
            :index="menu.path"> <i :class="menu.icon"></i>{{menu.text}}</el-menu-item>
          <el-submenu
            v-else
            :key="menu.path"
            :index="menu.path">
            <template slot="title"> <div :class="menu.path.slice(1)"><i :class="menu.icon"></i>{{menu.text}}</div></template>
            <el-menu-item
              v-for="subMenu in menu.children"
              :key="menu.path+subMenu.path"
              :index="menu.path+subMenu.path"
              :class="subMenu.path.slice(1)"
              >{{subMenu.text}}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>

  </div>
</template>

<script>
export default {
  name: 'sidebar',
  data() {
    return {
      menus: [
        {
          text: '密罐管理',
          icon: 'esign-icon-icon_applications',
          path: '/honeypot-manage',
          children: [
            {
              text: '密罐拓扑',
              path: '/honeypot-topo',
            },
            {
              text: '蜜罐列表',
              path: '/honeypots',
            },
          ]
        },
        {
          text: '影子代理',
          icon: 'esign-icon-icon_densitys',
          path: '/shadow-agency',
          children: [
            {
              text: '协议转发',
              path: '/protocol-forwarding',
            },
            {
              text: '透明转发',
              path: '/transparent-forwarding',
            },
          ]
        },
        {
          text: '诱捕管理',
          icon: 'esign-icon-icon_decoy',
          path: '/trap-manage',
          children: [
            {
              text: '探针列表',
              path: '/probes',
            },
            {
              text: '自定义密签',
              path: '/custom-signature',
            },
            {
              text: '自定义诱饵',
              path: '/custom-decoy',
            },
          ]
        },

        // {
        //   text: '木马检测',
        //   icon: 'esign-icon-icon_attacks',
        //   path: '/trojans-detection',
        //   children: [
        //     {
        //       text: '木马列表',
        //       path: '/trojans',
        //     },
        //   ]
        // },
        {
          text: '告警管理',
          icon: 'esign-icon-icon_honeypotcluster',
          path: '/alarm-manage',
          children: [
            {
              text: '告警列表',
              path: '/alarms',
            },
            // {
            //   text: '攻击溯源',
            //   path: '/attack-tracing',
            // },
          ]
        },
        {
          text: '系统设置',
          icon: 'esign-icon-icon_setting',
          path: '/settings',
          children: [
            // {
            //   text: '告警配置',
            //   path: '/alarm',
            // },
            {
              text: '镜像源配置',
              path: '/mirror',
            },
            // {
            //   text: 'Redis配置',
            //   path: '/redisSetting',
            // },
            {
              text: '镜像列表',
              path: '/mirrors',
            },
            {
              text: '协议配置',
              path: '/treaty',
            },
            {
              text: '密签配置',
              path: '/trackingUrl',
            },
          ]
        },

      ],
      defaultActive: ''
    }
  },
  created() {
    this.defaultActive = this.$route.matched[1]?this.$route.matched[1].path:this.$route.path
  },
  watch: {
    '$route.path':{
      handler:function(newVal,oldVal){
        const menuEle = this.$refs.menu
        const index = this.$route.matched[1]?this.$route.matched[1].path:this.$route.path
        menuEle.activeIndex =index
        menuEle.updateActiveIndex(index)
      },
    }
  }
}
</script>

<style lang="less">
@import '../../assets/style/var';

.sidebar {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  width: 180px;
  height: 100%;
  overflow: hidden;
  background: @--background-color-black;

  .logo {
    flex: 0 0 57px;
    width: 100%;
    height: 57px;
    background: url('../../assets/logo_ehoney_white.svg') no-repeat;
    background-size: 120px 32px;
    background-position: left 18px center;
  }
  .menu {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar-thumb {
      background-color:rgba(255,255,255, .1);
    }

    &::-webkit-scrollbar-track {
      background-color: #171B22;
    }
  }
  .el-menu .el-menu-item,
  .el-menu .el-submenu__title {
    height: 48px;
    line-height: 48px;
    // font-weight: 400;
  }
  .el-menu {
    background: @--background-color-black;
    border: none;
    font-size: 14px;
    i{
      margin-right: 10px;
    }
    &-item {
      padding: 0px 18px;
      height: 48px;
      color: #ddd;
      font-size: 14px;
      i {
        color: #ddd;
      }
      &:hover, &.is-active {
        color: #0cfff8!important;
        background: linear-gradient(270deg, rgba(37, 147, 243, 0) 0%, #105ae2 100%)!important;
      }
      &.is-active {
        i {
          color: #0cfff8!important;
        }
        &::after {
          display: none;
        }
      }
    }
    &-item:hover {
      i {
        color: #0cfff8!important;
      }
    }
  }
  .el-submenu {
    &__title {
      color: #ddd;
      font-size: 14px;
      i {
        color: #ddd;
      }
      &:hover, &.is-active {
        color: #0cfff8!important;
        background: linear-gradient(270deg, rgba(37, 147, 243, 0) 0%, #105ae2 100%)!important;
        i {
          color: #0cfff8!important;
        }
      }
    }
    &.is-active {
      .el-submenu__title, i {
        color: #0cfff8!important;
      }
    }
  }
}
</style>
