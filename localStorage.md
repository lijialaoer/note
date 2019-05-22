---
title: localStorage
notebook: 2019.05.22
---
### 1.问题
 在 vue 中的筛选器filters中用的```localStorage.getItem()```去读取，导致页面渲染慢。
### 2.解决
 把```localStorage.getItem()```拿到筛选器filters方法之外。再传值给筛选器。
### 3.总结
 #### 1. filters
 1.  vue 中的筛选器 filters 在渲染的时候调用，每次修改或操作该条数据的是否也会实时调用。例如一个数组 arr 使用了 filters，arr 的长度为5，每操作修改一次 arr 中的数据， 都会触发5次 filters 方法的运行。所以不能把循环，数据读取等消耗时间的数据操作放到 filters 中去。
 2.  filters 中是没有 this。 this === undefined 。 
     filters 可以传值。 
     ```html
        <span>{{sourceTraderId | getSourceTrader('value')}}</span>
     ```
     ```javascript
     filters:{
         getSourceTrader(value1, value2){
             //这里的value1 就是 sourceTraderId
             //value2 就是 getSourceTrader('value')中的参数, 也就是 ‘value’
             console.log(value1, value2);
             
         }
     }
     ```
 #### 2. localStorage
  1.   写入 localStorage 的数据都会保存到磁盘上, 所以 ```localStorage.getItem()``` 等操作都属于 磁盘I/O 操作。而且 localStorage 是一个阻塞型方法，因此浏览器会停止处理页面直到数据从磁盘中读出。以至于出现上面的页面Dom渲染延迟。
  2.  localStorage 读取10个字符与读取2000个字符的速度是几乎一样的， 而且每次调用getItem()（或从localStorage读取属性）都会增加时耗，所以一定要确保每次访问读取数据最大化。对于任何一个变量或对象属性，你越快将它读取到内存，后续的所有操作也会越快。


### 4.参考资料
     localStorage读取性能:https://www.jianshu.com/p/0a3399c0d5e2
     [翻译]localStorage性能的好坏:https://www.cnblogs.com/shinnyChen/p/3779782.html