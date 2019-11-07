import XEUtils from 'xe-utils/methods/xe-utils'
import VXETable from 'vxe-table/lib/vxe-table'

const menuMap = {
  CLEAR_CELL ({ $table, row, column }: any) {
    if (row && column) {
      $table.clearData(row, column.property)
    }
  },
  CLEAR_ROW ({ $table, row }: any) {
    if (row) {
      $table.clearData(row)
    }
  },
  CLEAR_SELECTION_ROW ({ $table }: any) {
    $table.clearData($table.getSelectRecords())
  },
  CLEAR_ALL ({ $table }: any) {
    $table.clearData()
  },
  REVERT_CELL ({ $table, row, column }: any) {
    if (row && column) {
      $table.revertData(row, column.property)
    }
  },
  REVERT_ROW ({ $table, row }: any) {
    if (row) {
      $table.revertData(row)
    }
  },
  REVERT_SELECTION_ROW ({ $table }: any) {
    $table.revertData($table.getSelectRecords())
  },
  REVERT_ALL ({ $table }: any) {
    $table.revertData()
  },
  INSERT_ROW ({ $table, menu }: any) {
    $table.insert(menu.params)
  },
  INSERT_ACTIVED_ROW ({ $table, menu, column }: any) {
    const args = menu.params || []
    $table.insert(args[0])
      .then(({ row }: any) => $table.setActiveCell(row, args[1] || column.property))
  },
  INSERT_AT_ROW ({ $table, menu, row }: any) {
    if (row) {
      $table.insertAt(menu.params, row)
    }
  },
  INSERT_AT_ACTIVED_ROW ({ $table, menu, row, column }: any) {
    if (row) {
      const args = menu.params || []
      $table.insertAt(args[0], row)
        .then(({ row }: any) => $table.setActiveCell(row, args[1] || column.property))
    }
  },
  DELETE_ROW ({ $table, row }: any) {
    if (row) {
      $table.remove(row)
    }
  },
  DELETE_SELECTION_ROW ({ $table }: any) {
    $table.removeSelecteds()
  },
  DELETE_ALL ({ $table }: any) {
    $table.remove()
  },
  CLEAR_SORT ({ $table }: any) {
    $table.clearSort()
  },
  SORT_ASC ({ $table, column }: any, evnt: any) {
    if (column) {
      $table.triggerSortEvent(evnt, column, 'asc')
    }
  },
  SORT_DESC ({ $table, column }: any, evnt: any) {
    if (column) {
      $table.triggerSortEvent(evnt, column, 'desc')
    }
  },
  CLEAR_FILTER ({ $table, column }: any) {
    if (column) {
      $table.clearFilter(column.property)
    }
  },
  CLEAR_ALL_FILTER ({ $table }: any) {
    $table.clearFilter()
  },
  FILTER_CELL ({ $table, row, column }: any) {
    if (row && column) {
      let { property } = column
      $table.filter(property)
        .then((options: Array<any>) => {
          if (options.length) {
            let option = options[0]
            option.data = XEUtils.get(row, property)
            option.checked = true
          }
        })
        .then(() => $table.updateData())
    }
  },
  EXPORT_ROW ({ $table, menu, row }: any) {
    if (row) {
      let opts = { data: [row] }
      $table.exportData(menu.params ? XEUtils.assign(opts, menu.params[0]) : opts)
    }
  },
  EXPORT_SELECTION_ROW ({ $table, menu }: any) {
    let opts = { data: $table.getSelectRecords() }
    $table.exportData(menu.params ? XEUtils.assign(opts, menu.params[0]) : opts)
  },
  EXPORT_ALL ({ $table, menu }: any) {
    $table.exportData(menu.params)
  },
  HIDDEN_COLUMN ({ $table, column }: any) {
    if (column) {
      $table.hideColumn()
    }
  },
  RESET_COLUMN ({ $table }: any) {
    $table.resetCustoms()
  },
  RESET_RESIZABLE ({ $table }: any) {
    $table.resetResizable()
  },
  RESET_ALL ({ $table }: any) {
    $table.resetAll()
  }
}

function checkPrivilege (item: any, params: any) {
  let { code } = item
  let { columns, column } = params
  switch (code) {
    case 'CLEAR_SORT':
      item.disabled = !columns.some((column: any) => column.sortable && column.order)
      break
    case 'CLEAR_ALL_FILTER':
      item.disabled = !columns.some((column: any) => column.filters && column.filters.some((option: any) => option.checked))
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
      if (!item.disabled) {
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
                  item.disabled = !column.filters.some((option: any) => option.checked)
                  break
              }
            }
            break
        }
      }
      break
  }
}

function handlePrivilegeEvent (params: any) {
  params.options.forEach((list: Array<any>) => {
    list.forEach((item: any) => {
      checkPrivilege(item, params)
      if (item.children) {
        item.children.forEach((child: any) => {
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
  install (xtable: typeof VXETable) {
    xtable.interceptor.add('event.showMenu', handlePrivilegeEvent)
    xtable.menus.mixin(menuMap)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus)
}

export default VXETablePluginMenus
