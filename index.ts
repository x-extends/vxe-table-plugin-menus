/* eslint-disable no-unused-vars */
import XEUtils from 'xe-utils/ctor'
import {
  VXETable,
  MenuLinkParams,
  InterceptorMenuParams,
  MenuFirstOption,
  MenuChildOption,
  Table
} from 'vxe-table/lib/vxe-table'
/* eslint-enable no-unused-vars */

let handleCopy: (content: string | number) => boolean

function handleFixedColumn(fixed: string) {
  return function (params: MenuLinkParams) {
    const { $table, column } = params
    XEUtils.eachTree([column], column => {
      column.fixed = fixed
    })
    $table.refreshColumn()
  }
}

function handleCopyOrCut(params: MenuLinkParams, isCut?: boolean) {
  const { $table, row, column } = params
  if (row && column) {
    let text = ''
    if ($table.mouseConfig && $table.mouseOpts.area) {
      if (isCut) {
        $table.cutCellArea()
      } else {
        $table.copyCellArea()
      }
    } else {
      const { $vxe } = $table
      text = XEUtils.toString(XEUtils.get(row, column.property))
      // 操作内置剪贴板
      $vxe.clipboard = { text }
    }
    // 开始复制操作
    if (XEUtils.isFunction(handleCopy)) {
      handleCopy(text)
    } else {
      console.warn('Copy function does not exist, copy to clipboard failed.')
    }
  }
}

function getBeenMerges(params: { $table: Table, [key: string]: any }) {
  const { $table } = params
  const { visibleData } = $table.getTableData()
  const { visibleColumn } = $table.getTableColumn()
  const cellAreas = $table.mouseConfig && $table.mouseOpts.area ? $table.getCellAreas() : []
  const mergeList = $table.getMergeCells()
  return mergeList.filter(({ row: mergeRowIndex, col: mergeColIndex, rowspan: mergeRowspan, colspan: mergeColspan }) => {
    return cellAreas.some(areaItem => {
      const { rows, cols } = areaItem
      const startRowIndex = visibleData.indexOf(rows[0])
      const endRowIndex = visibleData.indexOf(rows[rows.length - 1])
      const startColIndex = visibleColumn.indexOf(cols[0])
      const endColIndex = visibleColumn.indexOf(cols[cols.length - 1])
      return mergeRowIndex >= startRowIndex && mergeRowIndex + mergeRowspan - 1 <= endRowIndex && mergeColIndex >= startColIndex && mergeColIndex + mergeColspan - 1 <= endColIndex
    })
  })
}

function handleClearMergeCells(params: { $table: Table, [key: string]: any }) {
  const { $table } = params
  const beenMerges = getBeenMerges(params)
  if (beenMerges.length) {
    $table.removeMergeCells(beenMerges)
  }
}

function abandoned(code: string, newCode: string) {
  console.warn(`The code "${code}" has been scrapped, please use "${newCode}"`)
}

const menuMap = {
  /**
   * 清除单元格数据的值；如果启用 mouse-config.area 功能，则清除区域范围内的单元格数据
   */
  CLEAR_CELL(params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      if ($table.mouseConfig && $table.mouseOpts.area) {
        const cellAreas = $table.getCellAreas()
        if (cellAreas && cellAreas.length) {
          cellAreas.forEach(areaItem => {
            const { rows, cols } = areaItem
            cols.forEach(column => {
              rows.forEach(row => {
                $table.clearData(row, column.property)
              })
            })
          })
        }
      } else {
        $table.clearData(row, column.property)
      }
    }
  },
  /**
   * 清除行数据的值
   */
  CLEAR_ROW(params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.clearData(row)
    }
  },
  // 已废弃
  CLEAR_SELECTED_ROW(params: MenuLinkParams) {
    abandoned('CLEAR_SELECTED_ROW', 'CLEAR_CHECKBOX_ROW')
    return menuMap.CLEAR_CHECKBOX_ROW(params)
  },
  /**
   * 清除复选框选中行数据的值
   */
  CLEAR_CHECKBOX_ROW(params: MenuLinkParams) {
    const { $table } = params
    $table.clearData($table.getCheckboxRecords())
  },
  /**
   * 清除所有数据的值
   */
  CLEAR_ALL(params: MenuLinkParams) {
    const { $table } = params
    $table.clearData()
  },
  /**
   * 还原单元格数据的值；如果启用 mouse-config.area 功能，则还原区域范围内的单元格数据
   */
  REVERT_CELL(params: MenuLinkParams) {
    const { $table, row, column } = params
    if (row && column) {
      if ($table.mouseConfig && $table.mouseOpts.area) {
        const cellAreas = $table.getCellAreas()
        if (cellAreas && cellAreas.length) {
          cellAreas.forEach(areaItem => {
            const { rows, cols } = areaItem
            cols.forEach(column => {
              rows.forEach(row => {
                $table.revertData(row, column.property)
              })
            })
          })
        }
      } else {
        $table.revertData(row, column.property)
      }
    }
  },
  /**
   * 还原行数据的值
   */
  REVERT_ROW(params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.revertData(row)
    }
  },
  // 已废弃
  REVERT_SELECTED_ROW(params: MenuLinkParams) {
    abandoned('REVERT_SELECTED_ROW', 'REVERT_CHECKBOX_ROW')
    return menuMap.REVERT_CHECKBOX_ROW(params)
  },
  /**
   * 还原复选框选中行数据的值
   */
  REVERT_CHECKBOX_ROW(params: MenuLinkParams) {
    const { $table } = params
    $table.revertData($table.getCheckboxRecords())
  },
  /**
   * 还原所有数据的值
   */
  REVERT_ALL(params: MenuLinkParams) {
    const { $table } = params
    $table.revertData()
  },
  /**
   * 复制单元格数据的值；如果启用 mouse-config.area 功能，则复制区域范围内的单元格数据，支持 Excel 和 WPS
   */
  COPY_CELL(params: MenuLinkParams) {
    handleCopyOrCut(params)
  },
  /**
   * 剪贴单元格数据的值；如果启用 mouse-config.area 功能，则剪贴区域范围内的单元格数据，支持 Excel 和 WPS
   */
  CUT_CELL(params: MenuLinkParams) {
    handleCopyOrCut(params, true)
  },
  /**
   * 粘贴从表格中被复制的数据；如果启用 mouse-config.area 功能，则粘贴区域范围内的单元格数据，不支持读取剪贴板
   */
  PASTE_CELL(params: MenuLinkParams) {
    const { $table, row, column } = params
    if ($table.mouseConfig && $table.mouseOpts.area) {
      $table.pasteCellArea()
    } else {
      const { $vxe } = $table
      const { clipboard } = $vxe
      // 读取内置剪贴板
      if (clipboard && clipboard.text) {
        XEUtils.set(row, column.property, clipboard.text)
      }
    }
  },
  /**
   * 如果启用 mouse-config.area 功能，临时合并区域范围内的单元格
   */
  MERGE_CELL(params: MenuLinkParams) {
    const { $table } = params
    const cellAreas = $table.getCellAreas()
    handleClearMergeCells(params)
    $table.setMergeCells(
      cellAreas.map(({ rows, cols }) => {
        return {
          row: rows[0],
          col: cols[0],
          rowspan: rows.length,
          colspan: cols.length
        }
      })
    )
  },
  /**
   * 如果启用 mouse-config.area 功能，清除区域范围内单元格的临时合并状态
   */
  CLEAR_MERGE_CELL(params: MenuLinkParams) {
    handleClearMergeCells(params)
  },
  /**
   * 清除所有单元格及表尾的临时合并状态
   */
  CLEAR_ALL_MERGE(params: MenuLinkParams) {
    const { $table } = params
    $table.clearMergeCells()
    $table.clearMergeFooterItems()
  },
  /**
   * 插入数据
   */
  INSERT_ROW(params: MenuLinkParams) {
    const { $table, menu } = params
    $table.insert(menu.params)
  },
  /**
   * 插入数据并激活编辑状态
   */
  INSERT_ACTIVED_ROW(params: MenuLinkParams) {
    const { $table, menu, column } = params
    const args: any[] = menu.params || []
    $table.insert(args[0])
      .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
  },
  /**
   * 插入数据到指定位置
   */
  INSERT_AT_ROW(params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      $table.insertAt(menu.params, row)
    }
  },
  /**
   * 插入数据到指定位置并激活编辑状态
   */
  INSERT_AT_ACTIVED_ROW(params: MenuLinkParams) {
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
  DELETE_ROW(params: MenuLinkParams) {
    const { $table, row } = params
    if (row) {
      $table.remove(row)
    }
  },
  // 已废弃
  DELETE_SELECTED_ROW(params: MenuLinkParams) {
    abandoned('DELETE_SELECTED_ROW', 'DELETE_CHECKBOX_ROW')
    return menuMap.DELETE_CHECKBOX_ROW(params)
  },
  /**
   * 移除复选框选中行数据
   */
  DELETE_CHECKBOX_ROW(params: MenuLinkParams) {
    const { $table } = params
    $table.removeCheckboxRow()
  },
  /**
   * 移除所有行数据
   */
  DELETE_ALL(params: MenuLinkParams) {
    const { $table } = params
    $table.remove()
  },
  /**
   * 清除排序条件
   */
  CLEAR_SORT(params: MenuLinkParams) {
    const { $table } = params
    $table.clearSort()
  },
  /**
   * 按所选列的值升序
   */
  SORT_ASC(params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'asc')
    }
  },
  /**
   * 按所选列的值倒序
   */
  SORT_DESC(params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.sort(column.property, 'desc')
    }
  },
  /**
   * 清除复选框选中列的筛选条件
   */
  CLEAR_FILTER(params: MenuLinkParams) {
    const { $table, column } = params
    if (column) {
      $table.clearFilter(column)
    }
  },
  /**
   * 清除所有列筛选条件
   */
  CLEAR_ALL_FILTER(params: MenuLinkParams) {
    const { $table } = params
    $table.clearFilter()
  },
  /**
   * 根据单元格值筛选
   */
  FILTER_CELL(params: MenuLinkParams) {
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
  EXPORT_ROW(params: MenuLinkParams) {
    const { $table, menu, row } = params
    if (row) {
      let opts = { data: [row] }
      $table.exportData(XEUtils.assign(opts, menu.params[0]))
    }
  },
  // 已废弃
  EXPORT_SELECTED_ROW(params: MenuLinkParams) {
    abandoned('EXPORT_SELECTED_ROW', 'EXPORT_CHECKBOX_ROW')
    return menuMap.EXPORT_CHECKBOX_ROW(params)
  },
  /**
   * 导出复选框选中行数据
   */
  EXPORT_CHECKBOX_ROW(params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.exportData(XEUtils.assign(opts, menu.params[0]))
  },
  /**
   * 导出所有行数据
   */
  EXPORT_ALL(params: MenuLinkParams) {
    const { $table, menu } = params
    $table.exportData(menu.params)
  },
  /**
   * 打印所有行数据
   */
  PRINT_ALL(params: MenuLinkParams) {
    const { $table, menu } = params
    $table.print(menu.params)
  },
  // 已废弃
  PRINT_SELECTED_ROW(params: MenuLinkParams) {
    abandoned('PRINT_SELECTED_ROW', 'PRINT_CHECKBOX_ROW')
    return menuMap.PRINT_CHECKBOX_ROW(params)
  },
  /**
   * 打印复选框选中行
   */
  PRINT_CHECKBOX_ROW(params: MenuLinkParams) {
    const { $table, menu } = params
    let opts = { data: $table.getCheckboxRecords() }
    $table.print(XEUtils.assign(opts, menu.params))
  },
  /**
   * 隐藏当前列
   */
  HIDDEN_COLUMN(params: MenuLinkParams) {
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
  RESET_COLUMN(params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: true, resizable: false })
  },
  /**
   * 重置列宽状态
   */
  RESET_RESIZABLE(params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn({ visible: false, resizable: true })
  },
  /**
   * 重置列的所有状态
   */
  RESET_ALL(params: MenuLinkParams) {
    const { $table } = params
    $table.resetColumn(true)
  }
}

function checkPrivilege(item: MenuFirstOption | MenuChildOption, params: InterceptorMenuParams) {
  let { code } = item
  let { $table, columns, column } = params
  switch (code) {
    case 'CLEAR_SORT': {
      item.disabled = !columns.some((column) => column.sortable && column.order)
      break
    }
    case 'CLEAR_ALL_FILTER': {
      item.disabled = !columns.some((column) => column.filters && column.filters.some((option) => option.checked))
      break
    }
    case 'CLEAR_ALL_MERGE': {
      const mergeCells = $table.getMergeCells()
      const mergeFooterItems = $table.getMergeFooterItems()
      item.disabled = !mergeCells.length && !mergeFooterItems.length
      break
    }
    case 'CLEAR_MERGE_CELL': {
      const beenMerges = getBeenMerges(params)
      item.disabled = !beenMerges.length
      break
    }
    case 'CLEAR_CELL':
    case 'CLEAR_ROW':
    case 'COPY_CELL':
    case 'CUT_CELL':
    case 'PASTE_CELL':
    case 'MERGE_CELL':
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
    case 'CLEAR_FIXED_COLUMN': {
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
          case 'MERGE_CELL': {
            const cellAreas = $table.mouseConfig && $table.mouseOpts.area ? $table.getCellAreas() : []
            item.disabled = !cellAreas.length || (cellAreas.length === 1 && cellAreas[0].rows.length === 1 && cellAreas[0].cols.length === 1)
            break
          }
          case 'FIXED_LEFT_COLUMN':
            item.disabled = isChildCol || column.fixed === 'left'
            break
          case 'FIXED_RIGHT_COLUMN':
            item.disabled = isChildCol || column.fixed === 'right'
            break
          case 'CLEAR_FIXED_COLUMN':
            item.disabled = isChildCol || !column.fixed
            break
          case 'PASTE_CELL': {
            const { $vxe } = $table
            const { clipboard } = $vxe
            item.disabled = !clipboard || !clipboard.text
            break
          }
        }
      }
      break
    }
  }
}

function handlePrivilegeEvent(params: InterceptorMenuParams) {
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
  install({ interceptor, menus }: typeof VXETable, options?: { copy?: typeof handleCopy }) {
    if (options && options.copy) {
      handleCopy = options.copy
    } else if (window.XEClipboard) {
      handleCopy = window.XEClipboard.copy
    }
    interceptor.add('event.showMenu', handlePrivilegeEvent)
    menus.mixin(menuMap)
  }
}

declare global {
  interface Window {
    XEClipboard?: {
      copy: (content: string | number) => boolean
    };
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus)
}

export default VXETablePluginMenus
