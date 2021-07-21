# 欺骗防御前端



### 环境支持

> node 大于等于 10.0.0



### 框架

> Vue 2.6.12



### 项目设置

```
yarn install
```



### 编译和热加载

```
yarn serve
```



### 编译打包产品

```
yarn build
```



### lint检查

```
yarn lint
```



### 通用配置

See [Configuration Reference](https://cli.vuejs.org/config/).



### 目录结构

#### public

- static index.html中引入的静态资源

- intro 新手引导用到的js库

#### src 

- assets 图片等静态资源

- components 公共组件，如布局组件，面包屑等

- ib js库
- config.js是页面中的一些配置信息，如蜜罐的状态选项等
- util.js存放页面中的公共方法

- mixins 多个组件中的重复逻辑，目前只有新手引导组件的逻辑

- modules 多个页面中使用的重复组件，或者一些可以复用的组件

- plugins 项目中使用到的插件

- router 路由信息

- store 页面之间的共享数据

- views 项目中的所有页面，以菜单为维度，一个一级菜单对应一个文件夹，每个二级菜单对应文件夹中的一个文件






