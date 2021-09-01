# decept-defense-front

## Environment Support

   node>=10.0.0

## Framework 

 vue 2.6.12
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Directory structure

### public

  -- static index.html中引入的静态资源

    -- intro 新手引导用到的js库

### src 项目源码

  -- assets 图片等静态资源

  -- components 公共组件，如布局组件，面包屑等

  -- lib js库

     -- config.js是页面中的一些配置信息，如状态选项、表达正则校验等

     -- util.js存放页面中的公共方法

  -- mixins 多个组件中的重复逻辑

  -- plugins 项目中使用到的插件

  -- router 路由信息

  -- views 项目中的所有页面，以菜单为维度，一个一级菜单对应一个文件夹，每个二级菜单对应文件夹中的一个文件






