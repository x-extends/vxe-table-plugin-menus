# vxe-table-plugin-menus

[![gitee star](https://gitee.com/x-extends/vxe-table-plugin-menus/badge/star.svg?theme=dark)](https://gitee.com/x-extends/vxe-table-plugin-menus/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-menus.svg?style=flat-square)](https://www.npmjs.com/package/vxe-table-plugin-menus)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-menus.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-menus)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

基于 [vxe-table](https://www.npmjs.com/package/vxe-table) 的表格插件，提供实用的快捷菜单集

## Compatibility

依赖 vxe-table v4 版本  

## Installing

```shell
npm install vxe-table@next vxe-table-plugin-menus@next
```

```javascript
// ...
import VXETable from 'vxe-table'
import VXETablePluginMenus from 'vxe-table-plugin-menus'
// ...

VXETable.use(VXETablePluginMenus)

// Enable copy
/*
VXETable.use(VXETablePluginMenus, {
  // copy (text) {
  //   // 自定义复制函数
  // }
})
*/
```

## API

### Context menu codes

| code 编码 | describe 描述 | params 参数 |
|------|------|------|
| CLEAR_CELL | 清除单元格数据的值；如果启用 mouse-config.area 功能，则清除区域范围内的单元格数据 | — |
| CLEAR_ROW  | 清除行数据的值 | — |
| CLEAR_CHECKBOX_ROW  | 清除复选框选中行数据的值 | — |
| CLEAR_ALL  | 清除所有数据的值 | — |
| REVERT_CELL  | 还原单元格数据的值；如果启用 mouse-config.area 功能，则还原区域范围内的单元格数据 | — |
| REVERT_ROW  | 还原行数据的值 | — |
| REVERT_CHECKBOX_ROW  | 还原复选框选中行数据的值 | — |
| REVERT_ALL  | 还原所有数据的值 | — |
| MERGE_OR_CLEAR | 如果启用 mouse-config.area 功能，如果所选区域内已存在合并单元格，则取消临时合并，否则临时合并 | — |
| MERGE_CELL | 如果启用 mouse-config.area 功能，临时合并区域范围内的单元格，不管是否存在已合并 | — |
| CLEAR_MERGE_CELL | 如果启用 mouse-config.area 功能，清除区域范围内单元格的临时合并状态 | — |
| CLEAR_ALL_MERGE | 清除所有单元格及表尾的临时合并状态 | — |
| COPY_CELL | 复制单元格数据的值；如果启用 mouse-config.area 功能，则复制区域范围内的单元格数据，支持 Excel 和 WPS | — |
| CUT_CELL | 剪贴单元格数据的值；如果启用 mouse-config.area 功能，则剪贴区域范围内的单元格数据，支持 Excel 和 WPS | — |
| PASTE_CELL | （仅支持在单表区域内操作）粘贴从表格中被复制的数据；如果启用 mouse-config.area 功能，则粘贴区域范围内的单元格数据，不支持读取剪贴板 | — |
| EDIT_CELL | 编辑选中单元格 | — |
| EDIT_ROW | 编辑选中行并激活选中单元格 | — |
| INSERT_ROW | 插入数据 | records |
| INSERT_EDIT_ROW | 插入数据并激活编辑状态 | Array\<records, field\> |
| INSERT_AT_ROW | 插入数据到指定位置 | records |
| INSERT_AT_EDIT_ROW | 插入数据到指定位置并激活编辑状态 | Array\<records, field\> |
| DELETE_ROW | 移除行数据 | — |
| DELETE_AREA_ROW | 如果启用 mouse-config.area 功能，移除所选区域行数据 | — |
| DELETE_CHECKBOX_ROW  | 移除复选框选中行数据 | — |
| DELETE_ALL | 移除所有行数据 | — |
| CLEAR_SORT | 清除所选列排序条件 | — |
| CLEAR_ALL_SORT | 清除所有排序条件 | — |
| SORT_ASC | 按所选列的值升序 | — |
| SORT_DESC | 按所选列的值倒序 | — |
| CLEAR_FILTER | 清除选中列的筛选条件 | — |
| CLEAR_ALL_FILTER | 清除所有列筛选条件 | — |
| FILTER_CELL | 根据单元格值筛选 | — |
| EXPORT_ROW | 导出行数据 | options |
| EXPORT_CHECKBOX_ROW | 导出复选框选中行数据 | options |
| EXPORT_ALL  | 导出所有行数据 | options |
| PRINT_ALL | 打印所有行数据 | options |
| PRINT_CHECKBOX_ROW | 打印复选框选中行 | options |
| OPEN_FIND | 如果启用 mouse-config.area 功能，打开单元格查找功能 | — |
| OPEN_REPLACE | 如果启用 mouse-config.area 功能，打开单元格替换功能 | — |
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
  :menu-config="menuConfig"
  :edit-config="{trigger: 'click', mode: 'cell'}">
  <vxe-column type="seq" width="60"></vxe-column>
  <vxe-column field="name" title="Name" :edit-render="{name: 'input'}"></vxe-column>
  <vxe-column field="sex" title="sex" :edit-render="{name: 'input'}"></vxe-column>
  <vxe-column field="age" title="Age" :edit-render="{name: 'input'}"></vxe-column>
</vxe-table>
```

```javascript
export default {
  data () {
    return {
      tableData: [
        { id: 100,  name: 'test1', age: 28, sex: '1' },
        { id: 101,  name: 'test2', age: 32, sex: '0' },
        { id: 102,  name: 'test3', age: 36, sex: '1' }
      ],
      menuConfig: {
        body: {
          options: [
            [
              { code: 'EXPORT_ALL', name: '导出.csv' },
              { code: 'INSERT_EDIT_ROW', name: '新增' }
            ]
          ]
        }
      }
    }
  }
}
```

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan
