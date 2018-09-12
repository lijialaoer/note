###关于blob 下载

下载文件可以使用a 标签的download 来下载。download 写文件的名称，href 写文件下载的地址。注意的是，如果要写一个动态的下载，一定要动态添加整个a 标签，而不是写了a 标签，然后动态写它的 download 和 href 属性。

```<a download='fileName.xls' href='file is url'>```

下面是一个blob 下载 文件的例子

```javascript
var blob = new Blob([datas],{type:"application/vnd.ms-excel"});
		if(this.userBrowser() === 'IE' || this.userBrowser() === 'Edge'){
			if('msSaveOrOpenBlob' in navigator){
				window.navigator.msSaveOrOpenBlob(blob,'statistics.xls');
			}else{
				alert('浏览器版本过低，暂不支持下载操作，请升级浏览器后再进行此操作')
			}
		}else{
			var alink = document.createElement('a');
			alink.href= window.URL.createObjectURL(blob);
			alink.download = fileName;
			alink.style.display = 'none';
			document.body.appendChild(alink);
			alink.click();
			window.URL.revokeObjectURL(alink.href);
			document.body.removeChild(alink);
		}
```
关于 ```new blob([blob],type)```不在这里详述了。这里只是讲一下用a 标签下载的时候，a 标签是不兼容的，当然，最大的问题不是兼容这个a 标签,而是ie 与其他浏览器对于 blob 不同的处理方式。其他浏览器在用


```window.URL.createObjectURL(blob)```这个方法时，会直接把blob 生成如下的本地链接，这个链接于浏览器端生成，不会占用服务器端资源

```blob:https://www.wuxiancheng.cn/86e01467-6654-4b74-98b3-ca25f396bc2f```

而这个```window.URL.createObjectURL(blob)``` 在ie 中处理blob 时生成的是这样的 

```blob:242CACD6-06D5-4145-A6DA-55DBE47409DB``` 

这就造成了ie 无法打开一个链接了。解决的方式是 ie 有它自己的处理blob 转化url 的方法 ```window。navigator.msSaveOrOpenBlob(blob,fileName)```这个方法将blob 数据生成指定的文件名的供浏览器下载的文件。

参考资料：1.https://www.51-n.com/t-4535-1-1.html
          2.https://stackoverflow.com/questions/20310688/blob-download-not-working-in-ie

