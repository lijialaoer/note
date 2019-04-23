---
title: 纯前端导出excel
tags: sheet-js js-xlsx
time: 20198.04.23
---
### 1.描述
    工作需要导出excel, 尝试纯前端导出。
### 2. 方法
##### 1.安装
```
npm install js-xlsx --save-dev
```
##### 2.使用
    先组装好excel表格的整体范围，包括表头，合并的单元格，当然，你可以把这一步放到稍后再做，先去初始化表格。
```
//引入xlsx
import XLSX from 'xlsx';

//组建excel整体
//params:{ListData:这是数据表主体，type是Array, cropData:这个object中包含了表头，时间等其他信息，sheetName:excel名称}
function sheetTable(ListData, cropData, sheetName='销售订单'){
    //A-I
    let maxHeadCol = 9;//列数
    let rowLength = 7 + ListData.length;//行数
    let endRefs = getCharCol(keysHeader.length - 1) + rowLength;

    //sheet['!merges']中放的是合并表格的数据，{s:start, e:end， c:col(列)， r:row(行)}, 开始的合并的开始单元格位置 ，到合并结算的单元格位置。    //注意:从[0,0]开始，而不是 A:1, 当然[0,0]表示的其实就是excel中的A:1。
    //rowLength-1是倒数第二行， 从索引值0开始,所以在合并表格中 倒数第二行应该为 rowLength-2

    let sheet = {
        '!merges':[
            {s:{c:0, r:0}, e:{c:8, r:1}},
            {s:{c:0, r:2}, e:{c:6, r:3}},
            {s:{c:0, r:rowLength-2}, e:{c:6, r:rowLength-2}},
            {s:{c:7, r:rowLength-2}, e:{c:8, r:rowLength-2}},
            {s:{c:0, r:rowLength-1}, e:{c:8, r:rowLength-1}},
        ],
        //这里写的s为style(表格样式)，但这并不起作用
        'A1':{v:sheetName,s:{font:{ sz: 18, bold: true}, alignment:{vertical:'center', horizontal:'center', wrap_text: true}}},
        //sheet['!ref']表示表格的整个范围，从A1到一个值
        '!ref':'A1:' + endRefs
    }; 
    getBody(ListData, cropData, sheet, rowLength);     
}
```
    接下来组装好excel表格的body
```
function getBody(ListData, cropData, sheet, rowLength){
    //v:单元格原始内容， t:类型。 具体参看官网
    sheet['A3'] = {v:'单位名称：' + cropData.buyerName};
    sheet['H3'] = {v:'日期'};
    sheet['I3'] = {v:Date.now(), t:'d'};
    sheet['H4'] = {v:'订单编号'};
    sheet['I4'] = {v:cropData.orderNo};
    //商品数据th。keysHeader是我的表头数据
    for(let i=0, length=keysHeader.length; i<length; i++){
        sheet[getCharCol(i)+5] = {v:keysHeader[i].name};
    }
    //商品数据td (表格中心内容列表组装)
    for(let j=0, length=ListData.length; j<length; j++){
        for(let z=0, length=keysHeader.length; z<length; z++){
            if(keysHeader[z].label === 'index'){
                sheet[getCharCol(z) + (j + 6)] = {v:j+1};
            }else{
                sheet[getCharCol(z) + (j + 6)] = {v:ListData[j][keysHeader[z].label] ? ListData[j][keysHeader[z].label] : ''};
            }
            
        }
    }
    sheet['A' + (rowLength-1)] = {v:'合计'};
    sheet['H' + (rowLength-1)] = {v:'￥'+ cropData.finalTotalAmount};
    sheet['A' + rowLength] = {v:'订单备注：'+(cropData.remark ? cropData.remark : '')};
    return sheet;
}
```
    然后把上面组好的数据通过xlsx.js的方法写入sheet
```
//sheets中放的是工作表
function getsheetData(sheet){
    var wb = {
        SheetNames: ['Sheet1'],
        Sheets: {
            'Sheet1': sheet
        }
    };
    //bookType:file type, type:Output Type, bookSST:false,这个参数一般都设为false,具体参看官网
    var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
    //数据写入
    var wbout = XLSX.write(wb, wopts);
    //转化为buffer
    return s2ab(wbout);
}
```
    最后用以前写过的方法直接下载就好了。
### 3.总结
    1.写入表格时， 最后要注意转化为buffer或其他的二进制的类型
    2. 当单元格的类型设置为d(时间)的时候， v可以为时间戳也可以为yyyy-mm-dd之类的时间格式。但注意的是当设置为时间的时候，导出excel有时候会显示“#####”,这是因为单元格过窄造成的，把单元格拉宽一下就可以正常显示。
    3. 纯前端导出，会遇到许多兼容性问题，比如ie就不支持这样。还有其他例如表格样式的问题。
### 4. 问题
    1.导出excel格式问题。bookType='biff8|biff5'导出.xls，打开后格式混乱。所以目前我只导出的.xlsx格式的
    2.导出的excel设置表格样式需要用的xlsx-style, 不过我导入的时候报错，没有用。尝试cdn导入，也没有用。 


### 5.参考资料
  js-xlsx官网：https://github.com/sheetjs/js-xlsx
  xlsx-style：https://www.npmjs.com/package/xlsx-style
  其他： https://www.cnblogs.com/liuxianan/p/js-excel.html    
        https://www.jianshu.com/p/d3e3423fdb0d
        https://segmentfault.com/a/1190000018077543?utm_source=tag-newest