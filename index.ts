/* eslint-disable no-unused-vars */
import XEUtils from 'xe-utils/methods/xe-utils'
import {
  VXETable,
  MenuLinkParams,
  InterceptorMenuParams,
  MenuFirstOption,
  MenuChildOption
} from 'vxe-table/lib/vxe-table'
/* eslint-enable no-unused-vars */

function handleFixedColumn (fixed: string) {
  return function (params: MenuLinkParams) {
    const { $table, column } = params
    XEUtils.eachTree([column], column => {
      column.fixed = fixed
    })
    $table.refreshColumn()
  }
}

const menuMap = {
  /**
   * 清除单元格数据的值
   */
  CLEAR_CELL (params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      $table.clearData(row, column.property)
    }
  },
  /**
   * 清除行数据的值
   */
  CLEAR_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.clearData(row)
    }
  },
  /**
   * 清除选中行数据的值
   */
  CLEAR_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.clearData($table.getCheckboxRecords())
  },
  /**
   * 清除所有数据的值
   */
  CLEAR_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.clearData()
  },
  /**
   * 还原单元格数据的值
   */
  REVERT_CELL (params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      $table.revertData(row, column.property)
    }
  },
  /**
   * 还原行数据的值
   */
  REVERT_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.revertData(row)
    }
  },
  /**
   * 还原选中行数据的值
   */
  REVERT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.revertData($table.getCheckboxRecords())
  },
  /**
   * 还原所有数据的值
   */
  REVERT_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.revertData()
  },
  /**
   * 插入数据
   */
  INSERT_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.insert(menu.params)
  },
  /**
   * 插入数据并激活编辑状态
   */
  INSERT_ACTIVED_ROW (params: MenuLinkParams) {
    const { $table, menu, column } = params
    const args: any[] = menu.params || []
    $table.insert(args[0])
      .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
  },
  /**
   * 插入数据到指定位置
   */
  INSERT_AT_ROW (params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      $table.insertAt(menu.params, row)
    }
  },
  /**
   * 插入数据到指定位置并激活编辑状态
   */
  INSERT_AT_ACTIVED_ROW (params: MenuLinkParams) {
    const { $table, menu, row, column } = params
    if (row) {
      const args: any[] = menu.params || []
      $table.insertAt(args[0], row)
        .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
    }
  },
  /**
   * 移除行数据
   */
  DELETE_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.remove(row)
    }
  },
  /**
   * 移除选中行数据
   */
  DELETE_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.removeCheckboxRow()
  },
  /**
   * 移除所有行数据
   */
  DELETE_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.remove()
  },
  /**
   * 清除排序条件
   */
  CLEAR_SORT (params: MenuLinkParams) {
    const { $table } = params
    $table.clearSort()
  },
  /**
   * 按所选列的值升序
   */
  SORT_ASC (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'asc')
    }
  },
  /**
   * 按所选列的值倒序
   */
  SORT_DESC (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'desc')
    }
  },
  /**
   * 清除选中列的筛选条件
   */
  CLEAR_FILTER (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.clearFilter(column)
    }
  },
  /**
   * 清除所有列筛选条件
   */
  CLEAR_ALL_FILTER (params: MenuLinkParams) {
    const { $table } = params
    $table.clearFilter()
  },
  /**
   * 根据单元格值筛选
   */
  FILTER_CELL (params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      let { property, filters } = column
      if (filters.length) {
        let option = filters[0]
        option.data = XEUtils.get(row, property)
        option.checked = true
        $table.updateData()
      }
    }
  },
  /**
   * 导出行数据
   */
  EXPORT_ROW (params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      let opts = { data: [row] }
      $table.exportData(XEUtils.assign(opts, menu.params[0]))
    }
  },
  /**
   * 导出选中行数据
   */
  EXPORT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.exportData(XEUtils.assign(opts, menu.params[0]))
  },
  /**
   * 导出所有行数据
   */
  EXPORT_ALL (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.exportData(menu.params)
  },
  /**
   * 打印所有行数据
   */
  PRINT_ALL (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.print(menu.params)
  },
  /**
   * 打印选中行
   */
  PRINT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.print(XEUtils.assign(opts, menu.params))
  },
  /**
   * 隐藏当前列
   */
  HIDDEN_COLUMN (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.hideColumn(column)
    }
  },
  /**
   * 将列固定到左侧
   */
  FIXED_LEFT_COLUMN: handleFixedColumn('left'),
  /**
   * 将列固定到右侧
   */
  FIXED_RIGHT_COLUMN: handleFixedColumn('right'),
  /**
   * 清除固定列
   */
  CLEAR_FIXED_COLUMN: handleFixedColumn(''),
  /**
   * 重置列的可视状态
   */
  RESET_COLUMN (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: true, resizable: false })
  },
  /**
   * 重置列宽状态
   */
  RESET_RESIZABLE (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: false, resizable: true })
  },
  /**
   * 重置列的所有状态
   */
  RESET_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn(true)
  }
}

function checkPrivilege (item: MenuFirstOption | MenuChildOption, params: InterceptorMenuParams) {
  let { code } = item
  let { columns, column } = params
  switch (code) {
    case 'CLEAR_SORT':
      item.disabled = !columns.some((column) => column.sortable && column.order)
      break
    case 'CLEAR_ALL_FILTER':
      item.disabled = !columns.some((column) => column.filters && column.filters.some((option) => option.checked))
      break
    case 'CLEAR_CELL':
    case 'CLEAR_ROW':
    case 'REVERT_CELL':
    case 'REVERT_ROW':
    case 'INSERT_AT_ROW':
    case 'INSERT_AT_ACTIVED_ROW':
    case 'DELETE_ROW':
    case 'SORT_ASC':
    case 'SORT_DESC':
    case 'CLEAR_FILTER':
    case 'FILTER_CELL':
    case 'EXPORT_ROW':
    case 'HIDDEN_COLUMN':
    case 'FIXED_LEFT_COLUMN':
    case 'FIXED_RIGHT_COLUMN':
    case 'CLEAR_FIXED_COLUMN':
      item.disabled = !column
      if (column) {
        const isChildCol = !!column.parentId
        switch (code) {
          case 'SORT_ASC':
          case 'SORT_DESC':
            item.disabled = !column.sortable
            break
          case 'FILTER_CELL':
          case 'CLEAR_FILTER':
            item.disabled = !column.filters || !column.filters.length
            if (!item.disabled) {
              switch (code) {
                case 'CLEAR_FILTER':
                  item.disabled = !column.filters.some((option) => option.checked)
                  break
              }
            }
            break
          case 'FIXED_LEFT_COLUMN':
            item.disabled = isChildCol || column.fixed === 'left'
            break
          case 'FIXED_RIGHT_COLUMN':
            item.disabled = isChildCol || column.fixed === 'right'
            break
          case 'CLEAR_FIXED_COLUMN':
            item.disabled = isChildCol || !column.fixed
            break
        }
      }
      break
  }
}

function handlePrivilegeEvent (params: InterceptorMenuParams) {
  params.options.forEach((list) => {
    list.forEach((item) => {
      checkPrivilege(item, params)
      if (item.children) {
        item.children.forEach((child) => {
          checkPrivilege(child, params)
        })
      }
    })
  })
}

/**
 * 基于 vxe-table 表格的增强插件，提供实用的快捷菜单集
 */
export const VXETablePluginMenus = {
  install ({ interceptor, menus }: typeof VXETable) {
    interceptor.add('event.showMenu', handlePrivilegeEvent)
    menus.mixin(menuMap)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus)
}

export default VXETablePluginMenus
