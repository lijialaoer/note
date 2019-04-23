import XLSX from 'xlsx';
// import './xlsx';
// import './utils/xlsx.full.min.js';
// require('/xlsx-style/xlsx.js');
// const _xlsx_style = require('xlsx-style');
// import 'xlsx-style/dist/xlsx.core.min.js';

import {downFile} from '@/utils/index.js';
const keysHeader = [
    {name:'序号', label:'index'},
    {name:'商品名称', label:'name'},
    {name:'商品规格', label:'specStr'},
    {name:'包装', label:'packStr'},
    {name:'数量', label:'quantity'},
    {name:'单位', label:'miniUnit'},
    {name:'单价', label:'paidAmount'},
    {name:'金额', label:'finalAmount'},
    {name:'备注', label:'remark'},
];

// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。

function getCharCol(n) {
    if(n>=0 && n<=25){
        return String.fromCharCode(n + 65);
    }
    return false;
}
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}
function getsheetData(sheet){
    //写入头部
    console.log(sheet);
    
    var wb = {
        SheetNames: ['Sheet1'],
        Sheets: {
            'Sheet1': sheet
        }
    };
    var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
    var wbout = XLSX.write(wb, wopts);
    return s2ab(wbout);
}
function getBody(ListData, cropData, sheet, rowLength){
    sheet['A3'] = {v:'单位名称：' + cropData.buyerName};
    sheet['H3'] = {v:'日期'};
    sheet['I3'] = {v:Date.now(), t:'d'};
    sheet['H4'] = {v:'订单编号'};
    sheet['I4'] = {v:cropData.orderNo};
    //商品数据th
    for(let i=0, length=keysHeader.length; i<length; i++){
        sheet[getCharCol(i)+5] = {v:keysHeader[i].name};
    }
    //商品数据td
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
//
function sheetTable(ListData, cropData, sheetName='销售订单'){
    //A-I
    let maxHeadCol = 9;
    let rowLength = 7 + ListData.length;
    let endRefs = getCharCol(keysHeader.length - 1) + rowLength;
    //rowLength-1是倒数第二行， 从索引值0开始,所以-2
    let sheet = {
        '!merges':[
            {s:{c:0, r:0}, e:{c:8, r:1}},
            {s:{c:0, r:2}, e:{c:6, r:3}},
            {s:{c:0, r:rowLength-2}, e:{c:6, r:rowLength-2}},
            {s:{c:7, r:rowLength-2}, e:{c:8, r:rowLength-2}},
            {s:{c:0, r:rowLength-1}, e:{c:8, r:rowLength-1}},
        ],
        'A1':{v:sheetName,s:{font:{ sz: 18, bold: true}, alignment:{vertical:'center', horizontal:'center', wrap_text: true}}},
        '!ref':'A1:' + endRefs
    };
    console.log(ListData);
    
    // getsheetHeader(sheet);
    downFile(getsheetData(getBody(ListData, cropData, sheet, rowLength)), 'sheet.xlsx');
    
}
export default sheetTable;
