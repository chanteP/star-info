## 起个仓库放星星

```

return {
    area: this.name,
    rightAscension: this.getValue('赤经', sourceData),
    declination: this.getValue('赤纬', sourceData),
    apparentMagnitude: this.getValue('视星等', sourceData),
    absoluteMagnitude: this.getValue('绝对星等', sourceData),
    distance: this.getValue('距离（光年）', sourceData),
    name: this.getValue('名称', sourceData),
    classification: this.getValue('恒星分类', sourceData),
    wiki: this.getValue('名称', sourceData, 'l', {}).Target || '',
};

```
