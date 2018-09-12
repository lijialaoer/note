---
title: vue 动态添加DOM并绑定事件
tags: vue component dom 
notebook: 2018.09.11
---
###1.描述
  点击属性值，动态生成sku ,并在表格中展现出来。
###2.解决
  #####方法一
   用最原始的方法 js/jquery 去解决这个问题。当动态创建完成，```appenChild / append() /appendTo()```插入。但在创建的DOM上绑定事件或方法时，你需要与原始的方法一样去用事件委派，而不能写成```@click="add()"```类似的vue 方法绑定。因为你此时创建出来的DOM并不在 vue 的渲染机制内，它不会按 vue 的渲染模式去解析绑定的方法。所以最后会按字符串输出```@click="add()"```
  #####方法二
   第二种方式其实与第一种没什么太大的区别，它只是把插入的方式换成了 vue 的  v-html 的绑定。注意：v-html 只是渲染了html ，并不会触发```@click="add()"```的绑定事件，与方法一的原理是一样的。你想绑定事件，只能用事件委派。

   ```html
     <div v-html='message'></div>
   ```
   ```javascript
    data(){
      return {
          message:'<p>this is a p<p>'
      }
    }
   ```
  #####方法三
   最后一种方式是写一个 vue 的小组件，你可以在动态创建的方法内写，也可以写一个组件，然后引入当前组件中。如果你只需要动态创建像我当前描述的情况时，我建议在当前方法内直接创建组件，因为我把当前的组件当作了一个公共的组件，所以不想再引入其他组件了。当你用这种方式写一个组件时，你可以自由的用 vue 的语法。主要的代码我贴在下面
   ```javascript
     var myComponent = Vue.extend({
          template:tableDom,//这里的tableDom 是模板字符串,例如<div @click="creatZcyPrice"></div> 可以写
          data(){
            return {
              price:''
            }
          },
          methods:{
             creatZcyPrice(e){   
               var val = $(e.target).val() * (1 - _this.zcyDiscount / 100);
               $($(e.target).parentsUntil('tr')[$(e.target).parentsUntil('tr').length - 1]).parent('tr').find('.zcyPrice').val(val);  
            }
          }
        });
        var tabComponent = new myComponent().$mount();//模板组件添加到当前的 vue 的生命中期中，这样你写地 vue 语法就可以按vue 的渲染机制解析了。
         $('.skuTable').html(tabComponent.$el);//￥el 是当前的模板字符串
   ```
   这里我用的是 vue 组件与原始js 方法相嵌套的方式来写的。当前，可以直接写 $mount() 到任何地方。
