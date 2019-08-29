import XEUtils from 'xe-utils/methods/xe-utils'

const menuMap = {
  CLEAR_CELL ({ $table, row, column }) {
    if (row && column) {
      $table.clearData(row, column.property)
    }
  },
  CLEAR_ROW ({ $table, row }) {
    if (row) {
      $table.clearData(row)
    }
  },
  CLEAR_SELECTION_ROW ({ $table }) {
    $table.clearData($table.getSelectRecords())
  },
  CLEAR_ALL ({ $table }) {
    $table.clearData()
  },
  REVERT_CELL ({ $table, row, column }) {
    if (row && column) {
      $table.revertData(row, column.property)
    }
  },
  REVERT_ROW ({ $table, row }) {
    if (row) {
      $table.revertData(row)
    }
  },
  REVERT_SELECTION_ROW ({ $table }) {
    $table.revertData($table.getSelectRecords())
  },
  REVERT_ALL ({ $table }) {
    $table.revertData()
  },
  INSERT_ROW ({ $table, menu }) {
    $table.insert(menu.params)
  },
  INSERT_ACTIVED_ROW ({ $table, menu, column }) {
    const args = menu.params || []
    $table.insert(args[0])
      .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
  },
  INSERT_AT_ROW ({ $table, menu, row }) {
    if (row) {
      $table.insertAt(menu.params, row)
    }
  },
  INSERT_AT_ACTIVED_ROW ({ $table, menu, row, column }) {
    if (row) {
      const args = menu.params || []
      $table.insertAt(args[0], row)
        .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
    }
  },
  DELETE_ROW ({ $table, row }) {
    if (row) {
      $table.remove(row)
    }
  },
  DELETE_SELECTION_ROW ({ $table }) {
    $table.removeSelecteds()
  },
  DELETE_ALL ({ $table }) {
    $table.remove()
  },
  CLEAR_SORT ({ $table }) {
    $table.clearSort()
  },
  SORT_ASC ({ $table, column }) {
    if (column) {
      $table.sort(column.property, 'asc')
    }
  },
  SORT_DESC ({ $table, column }) {
    if (column) {
      $table.sort(column.property, 'desc')
    }
  },
  CLEAR_FILTER ({ $table, column }) {
    if (column) {
      $table.clearFilter(column.property)
    }
  },
  CLEAR_ALL_FILTER ({ $table }) {
    $table.clearFilter()
  },
  FILTER_CELL ({ $table, row, column }) {
    if (row && column) {
      let { property } = column
      $table.filter(property)
        .then(options => {
          if (options.length) {
            let option = options[0]
            option.data = XEUtils.get(row, property)
            option.checked = true
          }
        })
        .then(() => $table.updateData())
    }
  },
  EXPORT_ROW ({ $table, menu, row }) {
    if (row) {
      let opts = { data: [row] }
      $table.exportCsv(menu.params ? XEUtils.assign(opts, menu.params[0]) : opts)
    }
  },
  EXPORT_SELECTION_ROW ({ $table, menu }) {
    let opts = { data: $table.getSelectRecords() }
    $table.exportCsv(menu.params ? XEUtils.assign(opts, menu.params[0]) : opts)
  },
  EXPORT_ALL ({ $table }) {
    $table.exportCsv()
  },
  HIDDEN_COLUMN ({ $table, column }) {
    if (column) {
      $table.hideColumn()
    }
  },
  RESET_COLUMN ({ $table }) {
    $table.resetCustoms()
  },
  RESET_RESIZABLE ({ $table }) {
    $table.resetResizable()
  },
  RESET_ALL ({ $table }) {
    $table.resetAll()
  }
}

function checkPrivilege (item, params) {
  let { code } = item
  let { columns, column } = params
  switch (code) {
    case 'CLEAR_SORT':
      item.disabled = !columns.some(column => column.sortable && column.order)
      break
    case 'CLEAR_ALL_FILTER':
      item.disabled = !columns.some(column => column.filters && column.filters.some(option => option.checked))
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
                  item.disabled = !column.filters.some(option => option.checked)
                  break
              }
            }
            break
        }
      }
      break
  }
}

function handlePrivilegeEvent (params) {
  params.options.forEach(list => {
    list.forEach(item => {
      checkPrivilege(item, params)
      if (item.children) {
        item.children.forEach(child => {
          checkPrivilege(child, params)
        })
      }
    })
  })
}

export const VXETablePluginMenus = {
  install (VXETable) {
    let { interceptor, menus } = VXETable
    interceptor.add('event.show_menu', handlePrivilegeEvent)
    menus.mixin(menuMap)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus)
}

export default VXETablePluginMenus
