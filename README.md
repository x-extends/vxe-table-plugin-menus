# vxe-table-plugin-menus

[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-menus.svg?style=flat-square)](https://www.npmjs.org/package/vxe-table-plugin-menus)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-menus.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-menus)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-menus/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-menus/dist/index.min.js)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/xuliangzhan/vxe-table-plugin-menus/blob/master/LICENSE)

该插件用于在 [vxe-table](https://github.com/xuliangzhan/vxe-table) 表格中提供实用的快捷菜单集

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-menus
```

```javascript
import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginMenus from 'vxe-table-plugin-menus'

Vue.use(VXETable)
VXETable.use(VXETablePluginMenus)
```

## API

### Context menu codes

| 编码 | 描述 | 参数 |
|------|------|------|
| CLEAR_CELL | 清除单元格数据的值 | — |
| CLEAR_ROW  | 清除行数据的值 | — |
| CLEAR_SELECTION_ROW  | 清除选中行数据的值 | — |
| CLEAR_ALL  | 清除所有数据的值 | — |
| REVERT_CELL  | 还原单元格数据的值 | — |
| REVERT_ROW  | 还原行数据的值 | — |
| REVERT_SELECTION_ROW  | 还原选中行数据的值 | — |
| REVERT_ALL  | 还原所有数据的值 | — |
| INSERT_ROW | 新增行 | Array\<records, row\> |
| INSERT_ACTIVED_ROW | 新增行并激活编辑状态 | Array<Array\<records, row\>, Array\<field\>> |
| DELETE_ROW | 移除行数据 | — |
| DELETE_SELECTION_ROW  | 移除选中行数据 | — |
| DELETE_ALL | 移除所有行数据 | — |
| EXPORT_ROW | 导出行数据 | Object |
| EXPORT_SELECTION_ROW | 导出选中行数据 | Object |
| EXPORT_ALL  | 导出所有行数据 | Object |
| HIDDEN_COLUMN | 隐藏列 | — |
| RESET_COLUMN | 重置列可视状态 | — |
| RESET_RESIZABLE | 重置列宽状态 | — |
| RESET_ALL | 重置所有个性化数据 | — |

## demo

```html
<vxe-table
  border
  :data.sync="tableData"
  :context-menu="{body: {options: bodyMenus}}"
  :edit-config="{trigger: 'click', mode: 'cell'}">
  <vxe-table-column type="index" width="60"></vxe-table-column>
  <vxe-table-column field="name" title="Name" :edit-render="{name: 'input'}"></vxe-table-column>
  <vxe-table-column field="sex" title="sex" :edit-render="{name: 'input'}"></vxe-table-column>
  <vxe-table-column field="age" title="Age" :edit-render="{name: 'input'}"></vxe-table-column>
</vxe-table>
```

```javascript
export default {
  data () {
    return {
      tableData: [
        {
          id: 100,
          name: 'test1',
          age: 26,
          sex: '1'
        }
      ],
      bodyMenus: [
        [
          {
            code: 'EXPORT_ALL',
            name: '导出.csv'
          },
          {
            code: 'INSERT_ACTIVED_ROW',
            name: '新增'
          }
        ]
      ]
    }
  }
}
```

## License

MIT License, 2019-present, Xu Liangzhan
