<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="menu">
      <el-menu :default-active="$route.path" unique-opened ref="menu" router>
        <template v-for="menu in menus">
          <el-menu-item v-if="!menu.children || !menu.children.length" :key="menu.path" :index="menu.path"> <i :class="menu.icon"></i>{{menu.text}}</el-menu-item>
          <el-submenu v-else :key="menu.path" :index="menu.path">
            <template slot="title">
              <div :class="menu.path.slice(1)"><i :class="menu.icon"></i>{{menu.text}}</div>
            </template>
            <el-menu-item v-for="subMenu in menu.children" :key="menu.path+subMenu.path" :index="menu.path+subMenu.path" :class="subMenu.path.slice(1)">{{subMenu.text}}</el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  data () {
    return {
      menus: [
        {
          text: '威胁感知',
          icon: 'esign-icon-icon_attacks',
          path: '/threaten-perception',
          children: [
            {
              text: '攻击事件',
              path: '/traffic-attack',
            },
            {
              text: 'Falco事件',
              path: '/falco-event',
            },
            {
              text: '密签事件',
              path: '/token-track',
            },
            {
              text: '溯源',
              path: '/trace-source',
            },
            {
              text: '节点拓扑',
              path: '/honeypot-topo',
            },
          ]
        },
        {
          text: '密罐管理',
          icon: 'esign-icon-icon_applications',
          path: '/honeypots',
        },
        {
          text: '探针管理',
          icon: 'esign-icon-relation',
          path: '/probes-list',
        },
        {
          text: '代理管理',
          icon: 'esign-icon-icon_densitys',
          path: '/proxy-manage',
          children: [
            {
              text: '协议转发',
              path: '/protocol-forwarding',
            },
            {
              text: '透明转发',
              path: '/protocol-transparent',
            },
          ]
        },
        {
          text: '诱捕管理',
          icon: 'esign-icon-icon_honeypotcluster',
          path: '/trap-manage',
          children: [
            {
              text: '密签管理',
              path: '/token',
            },
            {
              text: '诱饵管理',
              path: '/trap',
            },
            {
              text: '协议类型',
              path: '/protocol-type',
            },
            {
              text: '镜像列表',
              path: '/image-list',
            },
          ]
        },
        {
          text: '系统设置',
          icon: 'esign-icon-icon_setting',
          path: '/system-config',
        },
      ],
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
      background-color: rgba(255, 255, 255, 0.1);
    }

    &::-webkit-scrollbar-track {
      background-color: #171b22;
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
    i {
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
      &:hover,
      &.is-active {
        color: #0cfff8 !important;
        background: linear-gradient(270deg, rgba(37, 147, 243, 0) 0%, #105ae2 100%) !important;
      }
      &.is-active {
        i {
          color: #0cfff8 !important;
        }
        &::after {
          display: none;
        }
      }
    }
    &-item:hover {
      i {
        color: #0cfff8 !important;
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
      &:hover,
      &.is-active {
        color: #0cfff8 !important;
        background: linear-gradient(270deg, rgba(37, 147, 243, 0) 0%, #105ae2 100%) !important;
        i {
          color: #0cfff8 !important;
        }
      }
    }
    &.is-active {
      .el-submenu__title,
      i {
        color: #0cfff8 !important;
      }
    }
  }
}
</style>
