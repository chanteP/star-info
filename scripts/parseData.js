// 好东西 https://zhuanlan.zhihu.com/p/33118167

const XLSX = require('xlsx');
const fs = require('fs-extra');

const filePath = process.argv[2];
const targetPathJSON = './data/starData-11407.json';
const targetPathJS = './data/starData-11407.js';

class Sign{
    constructor(name, data){
        this.name = name;
        this.data = data;
        this.header = this.parseHeader();
    }
    parseHeader(){
        let header = this.getLine(6);
        let map = {};
        Object.keys(header).forEach(cell => {
            map[header[cell].v] = cell;
        });
        return map;
    }

    parse(){
        let sheet = this.data;
        let start = 8;
        let end = sheet['!ref'].split(':')[1].slice(1) - 2;
        console.log('parse', this.name, `${start}:${end} in ${sheet['!ref']}`);
        
        let i = start;
        while(i <= end){
            let starInfo = this.formatInfo(this.getLine(i));
            list.push(starInfo);
            i++;
        }
    }

    formatInfo(sourceData){
        return {
            // 所在星座
            area: this.name,
            // 赤经
            rightAscension: this.getValue('赤经', sourceData),
            // 赤纬
            declination: this.getValue('赤纬', sourceData),
            // 视星等
            apparentMagnitude: this.getValue('视星等', sourceData),
            // 绝对星等
            absoluteMagnitude: this.getValue('绝对星等', sourceData),
            // 距离
            distance: this.getValue('距离（光年）', sourceData),

            name: this.getValue('名称', sourceData),
            // 几个别名
            // BayerName: this.getValue('拜耳命名', sourceData),
            // FlamsteedName: this.getValue('佛兰斯蒂德命名', sourceData),
            // 类别
            classification: this.getValue('恒星分类', sourceData),
            wiki: this.getValue('名称', sourceData, 'l', {}).Target || '',
        };
    }
    
    getLine(n){
        let start = 'A';
        let end = 'M';
        let i = start;
        let rs = {};
        while(i < end){
            rs[i] = this.data[i + n] || {};
            i = String.fromCharCode(i.charCodeAt() + 1);
        }
        return rs;
    }
    
    getValue(mapName, obj, key = 'v', defaultValue = ''){
        let cell = obj[this.header[mapName]];
        let value = cell && cell[key] || defaultValue;
        if(typeof value === 'string'){
            value = value.replace(/\[\d\]/, '');
        }
        return value;
    }
}

let workbook = XLSX.readFile(filePath);
let list = [];

workbook.SheetNames.forEach(signName => new Sign(signName, workbook.Sheets[signName]).parse());
console.log('total:', list.length);
fs.ensureFileSync(targetPathJSON);
fs.writeFileSync(targetPathJSON, JSON.stringify(list));
fs.ensureFileSync(targetPathJS);
fs.writeFileSync(targetPathJS, 'stars = [\n' + list.map(d => JSON.stringify(d)).join(',\n') + '\n]\n');

