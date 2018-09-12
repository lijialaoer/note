---
title: vue 动态添加路由 addRouter
tags: vue router
notebook: 2018.09.06
---
### 1.描述
 后台管理系统的菜单权限，由后台传输数据，前台进行动态渲染。<br>
 ### 2.解决
 ```javascript
     this.routers.push({
                    path: '/404',
                    name: '404',
                    component: (resolve) => require(['../components/404.vue'], resolve),
                }); 
        this.$router.options.routes[this.$router.options.routes.length-1].children = this.routers;//这里的不能用push,只能直接赋值
        var arr = [this.$router.options.routes[this.$router.options.routes.length-1]];
        //当把thisrouters 直接添加到路由中，会直接成为一级路径，把整体添加进去，才会呈现父子关系
      this.$router.addRoutes(arr);

 ```
 这里可以解决路由动态加载的问题，但这还不完整。如果进入菜单页面，然后刷新页面，路由又会消失。所以，这里我想到了利用全局的路由守卫来```router.beforeEach()``` 监听菜单页面是否刷新，当页面刷新时，将路由重新 addRouter <br>

---------------------------
该代码完成后，会出现主页面路由重复加载，由于vue 的路由会自动去重，所以不会报错，只会报警告。查询网上的解决方法，有的说可以重定向，但我自己试过后，依然报警告。所以目前没有解决掉，希望走过路过的大佬，指点一下。


