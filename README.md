# vxe-table-plugin-menus

[![gitee star](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-menus/badge/star.svg?theme=dark)](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-menus/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-menus.svg?style=flat-square)](https://www.npmjs.org/package/vxe-table-plugin-menus)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-menus.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-menus)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-menus/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-menus/dist/index.min.js)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

基于 [vxe-table](https://github.com/xuliangzhan/vxe-table) 表格的增强插件，提供实用的快捷菜单集

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-menus
```

```javascript
// ...
import VXETablePluginMenus from 'vxe-table-plugin-menus'
// ...

VXETable.use(VXETablePluginMenus)
```

## API

### Context menu codes

| code 编码 | describe 描述 | params 参数 |
|------|------|------|
| CLEAR_CELL | 清除单元格数据的值 | — |
| CLEAR_ROW  | 清除行数据的值 | — |
| CLEAR_SELECTED_ROW  | 清除选中行数据的值 | — |
| CLEAR_ALL  | 清除所有数据的值 | — |
| REVERT_CELL  | 还原单元格数据的值 | — |
| REVERT_ROW  | 还原行数据的值 | — |
| REVERT_SELECTED_ROW  | 还原选中行数据的值 | — |
| REVERT_ALL  | 还原所有数据的值 | — |
| INSERT_ROW | 插入数据 | records |
| INSERT_ACTIVED_ROW | 插入数据并激活编辑状态 | Array\<records, field\> |
| INSERT_AT_ROW | 插入数据到指定位置 | records |
| INSERT_AT_ACTIVED_ROW | 插入数据到指定位置并激活编辑状态 | Array\<records, field\> |
| DELETE_ROW | 移除行数据 | — |
| DELETE_SELECTED_ROW  | 移除选中行数据 | — |
| DELETE_ALL | 移除所有行数据 | — |
| CLEAR_SORT | 清除排序条件 | — |
| SORT_ASC | 按所选列的值升序 | — |
| SORT_DESC | 按所选列的值倒序 | — |
| CLEAR_FILTER | 清除选中列的筛选条件 | — |
| CLEAR_ALL_FILTER | 清除所有列筛选条件 | — |
| FILTER_CELL | 根据单元格值筛选 | — |
| EXPORT_ROW | 导出行数据 | options |
| EXPORT_SELECTED_ROW | 导出选中行数据 | options |
| EXPORT_ALL  | 导出所有行数据 | options |
| PRINT_ALL | 打印所有行数据 | options |
| PRINT_SELECTED_ROW | 打印选中行 | options |
| FIXED_LEFT_COLUMN | 将列固定到左侧 | — |
| FIXED_RIGHT_COLUMN | 将列固定到右侧 | — |
| CLEAR_FIXED_COLUMN | 清除固定列 | — |
| HIDDEN_COLUMN | 隐藏当前列 | — |
| RESET_COLUMN | 重置列的可视状态 | — |
| RESET_RESIZABLE | 重置列宽状态 | — |
| RESET_ALL | 重置列的所有状态 | — |

## demo

```html
<vxe-table
  :data="tableData"
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

[MIT](LICENSE) © 2019-present, Xu Liangzhan
