import XEUtils from 'xe-utils/methods/xe-utils'
import { VXETable, MenuLinkParams, InterceptorMenuParams, FirstMenuOption, ChildMenuOption } from 'vxe-table/lib/vxe-table' // eslint-disable-line no-unused-vars

const menuMap = {
  CLEAR_CELL (params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      $table.clearData(row, column.property)
    }
  },
  CLEAR_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.clearData(row)
    }
  },
  CLEAR_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.clearData($table.getCheckboxRecords())
  },
  CLEAR_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.clearData()
  },
  REVERT_CELL (params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      $table.revertData(row, column.property)
    }
  },
  REVERT_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.revertData(row)
    }
  },
  REVERT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.revertData($table.getCheckboxRecords())
  },
  REVERT_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.revertData()
  },
  INSERT_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.insert(menu.params)
  },
  INSERT_ACTIVED_ROW (params: MenuLinkParams) {
    const { $table, menu, column } = params
    const args = menu.params || []
    $table.insert(args[0])
      .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
  },
  INSERT_AT_ROW (params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      $table.insertAt(menu.params, row)
    }
  },
  INSERT_AT_ACTIVED_ROW (params: MenuLinkParams) {
    const { $table, menu, row, column } = params
    if (row) {
      const args = menu.params || []
      $table.insertAt(args[0], row)
        .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
    }
  },
  DELETE_ROW (params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.remove(row)
    }
  },
  DELETE_SELECTED_ROW (params: MenuLinkParams) {
    const { $table } = params
    $table.removeCheckboxRow()
  },
  DELETE_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.remove()
  },
  CLEAR_SORT (params: MenuLinkParams) {
    const { $table } = params
    $table.clearSort()
  },
  SORT_ASC (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'asc')
    }
  },
  SORT_DESC (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'desc')
    }
  },
  CLEAR_FILTER (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.clearFilter(column.property)
    }
  },
  CLEAR_ALL_FILTER (params: MenuLinkParams) {
    const { $table } = params
    $table.clearFilter()
  },
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
  EXPORT_ROW (params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      let opts = { data: [row] }
      $table.exportData(XEUtils.assign(opts, menu.params[0]))
    }
  },
  EXPORT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.exportData(XEUtils.assign(opts, menu.params[0]))
  },
  EXPORT_ALL (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.exportData(menu.params)
  },
  PRINT_ALL (params: MenuLinkParams) {
    const { $table, menu } = params
    $table.print(menu.params)
  },
  PRINT_SELECTED_ROW (params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.print(XEUtils.assign(opts, menu.params))
  },
  HIDDEN_COLUMN (params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.hideColumn(column)
    }
  },
  RESET_COLUMN (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: true, resizable: false })
  },
  RESET_RESIZABLE (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: false, resizable: true })
  },
  RESET_ALL (params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn(true)
  }
}

function checkPrivilege (item: FirstMenuOption | ChildMenuOption, params: InterceptorMenuParams) {
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
      item.disabled = !column
      if (column) {
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
