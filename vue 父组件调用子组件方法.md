---
title: vue 父组件调用子组件中的方法
tags: vue props中type为function
notebook: 2019.04.29
---
### 1.描述
 看element-ui 树形组件tree的源码，发现父子组件中的传值可以用Funciton，而且子组件可以把一个函数表达式传递给父组件，然后父组件直接调用。
### 2.解析

父组件
```html
<!-- 调用子组件 -->
    <tree 
            v-model='id'
            :treeData='menuList'
            :loadNode='loadNode'
        />
```
```javascript
    function loadNode(node, reslove){
        reslove('这是父组件调用的');
    }
```

子组件
```html
    <el-button @click="_click(1)">点击</el-button>
```
```javascript
export default{
    props:{
        loadNode:{
            type:Function,
        }
    },
    methods:{
        _click(data){
            if(this.loadNode){
                this.loadNode(data, this._alter);
            }
        },
        _alter(data){
            alter(data);
        }
    }
}
```
这里父组件传给子组件一个带有函数表达式

