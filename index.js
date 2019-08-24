import XEUtils from 'xe-utils'

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
    $table.insertAt.apply($table, menu.params || [])
  },
  INSERT_ACTIVED_ROW ({ $table, menu }) {
    const args = menu.params || []
    $table.insertAt.apply($table, args[0] || [])
      .then(({ row }) => args[1] ? $table.setActiveRow(row) : $table.setActiveCell.apply($table, [row].concat(args[1])))
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

export const VXETablePluginMenus = {
  install ({ menus }) {
    menus.mixin(menuMap)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus)
}

export default VXETablePluginMenus
