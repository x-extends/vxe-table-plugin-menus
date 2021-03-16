import XEUtils from 'xe-utils'
import { VXETableCore,  VxeColumnPropTypes, VxeTableDefines, VxeTableProDefines, VxeGlobalInterceptorHandles, VxeGlobalMenusHandles } from 'vxe-table'

let vxetable:VXETableCore

let handleCopy: (content: string | number) => boolean

function handleFixedColumn(fixed: VxeColumnPropTypes.Fixed) {
  return function (params: VxeGlobalMenusHandles.MenusCallbackParams) {
    const { $table, column } = params
    XEUtils.eachTree([column], (column) => {
      column.fixed = fixed
    })
    $table.refreshColumn()
  }
}

function handleCopyOrCut(params: VxeGlobalMenusHandles.MenusCallbackParams, isCut?: boolean) {
  const { $table, row, column } = params
  if (row && column) {
    const { props } = $table
    const { mouseConfig } = props
    const { computeMouseOpts } = $table.getComputeMaps()
    const mouseOpts = computeMouseOpts.value
    let text = ''
    if (mouseConfig && mouseOpts.area) {
      const clipRest = isCut ? $table.cutCellArea() : $table.copyCellArea()
      text = clipRest.text
    } else {
      text = XEUtils.toValueString(XEUtils.get(row, column.property))
      // 操作内置剪贴板
      vxetable.config.clipboard = { text }
    }
    // 开始复制操作
    if (XEUtils.isFunction(handleCopy)) {
      handleCopy(text)
    } else {
      console.warn('Copy function does not exist, copy to clipboard failed.')
    }
  }
}

function checkCellOverlay(params: VxeGlobalInterceptorHandles.InterceptorShowMenuParams, cellAreas: VxeTableProDefines.MouseCellArea[]) {
  const { $table } = params
  const { visibleData } = $table.getTableData()
  const { visibleColumn } = $table.getTableColumn()
  const indexMaps: { [key: string]: boolean } = {}
  for (let aIndex = 0, areaSize = cellAreas.length; aIndex < areaSize; aIndex++) {
    const areaItem = cellAreas[aIndex]
    const { rows, cols } = areaItem
    for (let rIndex = 0, rowSize = rows.length; rIndex < rowSize; rIndex++) {
      const offsetRow = rows[rIndex]
      const orIndex = visibleData.indexOf(offsetRow)
      for (let cIndex = 0, colSize = cols.length; cIndex < colSize; cIndex++) {
        const offsetColumn = cols[cIndex]
        const ocIndex = visibleColumn.indexOf(offsetColumn)
        const key = orIndex + ':' + ocIndex
        if (indexMaps[key]) {
          return false
        }
        indexMaps[key] = true
      }
    }
  }
  return true
}

function getBeenMerges(params: VxeGlobalMenusHandles.MenusCallbackParams | VxeGlobalInterceptorHandles.InterceptorShowMenuParams) {
  const { $table } = params
  const { props } = $table
  const { mouseConfig } = props
  const { computeMouseOpts } = $table.getComputeMaps()
  const mouseOpts = computeMouseOpts.value
  const { visibleData } = $table.getTableData()
  const { visibleColumn } = $table.getTableColumn()
  const cellAreas = mouseConfig && mouseOpts.area ? $table.getCellAreas() : []
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

function handleClearMergeCells(params: VxeGlobalMenusHandles.MenusCallbackParams) {
  const { $table } = params
  const beenMerges = getBeenMerges(params)
  if (beenMerges.length) {
    $table.removeMergeCells(beenMerges)
  }
}

function checkPrivilege(item: VxeTableDefines.MenuFirstOption | VxeTableDefines.MenuChildOption, params: VxeGlobalInterceptorHandles.InterceptorShowMenuParams) {
  let { code } = item
  let { $table, columns, column } = params
  const { props } = $table
  const { editConfig, mouseConfig } = props
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
    case 'EDIT_CELL':
    case 'CLEAR_CELL':
    case 'CLEAR_ROW':
    case 'COPY_CELL':
    case 'CUT_CELL':
    case 'PASTE_CELL':
    case 'MERGE_OR_CLEAR':
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
    case 'OPEN_FIND':
    case 'OPEN_REPLACE':
    case 'HIDDEN_COLUMN':
    case 'FIXED_LEFT_COLUMN':
    case 'FIXED_RIGHT_COLUMN':
    case 'CLEAR_FIXED_COLUMN': {
      item.disabled = !column
      if (column) {
        const { computeMouseOpts } = $table.getComputeMaps()
        const mouseOpts = computeMouseOpts.value
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
          case 'OPEN_FIND':
          case 'OPEN_REPLACE': {
            item.disabled = !(mouseConfig && mouseOpts.area)
            break
          }
          case 'EDIT_CELL': {
            item.disabled = !editConfig || !column.editRender
            break
          }
          case 'COPY_CELL':
          case 'CUT_CELL':
          case 'PASTE_CELL': {
            const cellAreas = mouseConfig && mouseOpts.area ? $table.getCellAreas() : []
            item.disabled = cellAreas.length > 1
            if (!item.disabled) {
              switch (code) {
                case 'PASTE_CELL':
                  const { clipboard } = vxetable.config
                  item.disabled = !clipboard || !clipboard.text
                  break
              }
            }
            break
          }
          case 'MERGE_OR_CLEAR':
          case 'MERGE_CELL': {
            const cellAreas = mouseConfig && mouseOpts.area ? $table.getCellAreas() : []
            item.disabled = !cellAreas.length || (cellAreas.length === 1 && cellAreas[0].rows.length === 1 && cellAreas[0].cols.length === 1) || !checkCellOverlay(params, cellAreas)
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
        }
      }
      break
    }
  }
}

function handlePrivilegeEvent(params: VxeGlobalInterceptorHandles.InterceptorShowMenuParams) {
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

interface VXETablePluginMenusOptions {
  copy?: typeof handleCopy;
}

function pluginSetup(options?: VXETablePluginMenusOptions) {
  if (options && options.copy) {
    handleCopy = options.copy
  }
}

/**
 * 基于 vxe-table 表格的增强插件，提供实用的快捷菜单集
 */
export const VXETablePluginMenus = {
  setup: pluginSetup,
  install(vxetablecore: VXETableCore, options?: VXETablePluginMenusOptions) {
    const { interceptor, menus } = vxetablecore

    vxetable = vxetablecore

    if (window.XEClipboard) {
      handleCopy = window.XEClipboard.copy
    }
    pluginSetup(options)

    menus.mixin({
      /**
       * 清除单元格数据的值；如果启用 mouse-config.area 功能，则清除区域范围内的单元格数据
       */
      CLEAR_CELL(params) {
        const { $table, row, column } = params
        if (row && column) {
          const { props } = $table
          const { mouseConfig } = props
          const { computeMouseOpts } = $table.getComputeMaps()
          const mouseOpts = computeMouseOpts.value
          if (mouseConfig && mouseOpts.area) {
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
      CLEAR_ROW(params) {
        const { $table, row } = params
        if (row) {
          $table.clearData(row)
        }
      },
      /**
       * 清除复选框选中行数据的值
       */
      CLEAR_CHECKBOX_ROW(params) {
        const { $table } = params
        $table.clearData($table.getCheckboxRecords())
      },
      /**
       * 清除所有数据的值
       */
      CLEAR_ALL(params) {
        const { $table } = params
        $table.clearData()
      },
      /**
       * 还原单元格数据的值；如果启用 mouse-config.area 功能，则还原区域范围内的单元格数据
       */
      REVERT_CELL(params) {
        const { $table, row, column } = params
        if (row && column) {
          const { props } = $table
          const { mouseConfig } = props
          const { computeMouseOpts } = $table.getComputeMaps()
          const mouseOpts = computeMouseOpts.value
          if (mouseConfig && mouseOpts.area) {
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
      REVERT_ROW(params) {
        const { $table, row } = params
        if (row) {
          $table.revertData(row)
        }
      },
      /**
       * 还原复选框选中行数据的值
       */
      REVERT_CHECKBOX_ROW(params) {
        const { $table } = params
        $table.revertData($table.getCheckboxRecords())
      },
      /**
       * 还原所有数据的值
       */
      REVERT_ALL(params) {
        const { $table } = params
        $table.revertData()
      },
      /**
       * 复制单元格数据的值；如果启用 mouse-config.area 功能，则复制区域范围内的单元格数据，支持 Excel 和 WPS
       */
      COPY_CELL(params) {
        handleCopyOrCut(params)
      },
      /**
       * 剪贴单元格数据的值；如果启用 mouse-config.area 功能，则剪贴区域范围内的单元格数据，支持 Excel 和 WPS
       */
      CUT_CELL(params) {
        handleCopyOrCut(params, true)
      },
      /**
       * 粘贴从表格中被复制的数据；如果启用 mouse-config.area 功能，则粘贴区域范围内的单元格数据，不支持读取剪贴板
       */
      PASTE_CELL(params) {
        const { $table, row, column } = params
        const { props } = $table
        const { mouseConfig } = props
        const { computeMouseOpts } = $table.getComputeMaps()
        const mouseOpts = computeMouseOpts.value
        if (mouseConfig && mouseOpts.area) {
          $table.pasteCellArea()
        } else {
          const { clipboard } = vxetable.config
          // 读取内置剪贴板
          if (clipboard && clipboard.text) {
            XEUtils.set(row, column.property, clipboard.text)
          }
        }
      },
      /**
       * 如果启用 mouse-config.area 功能，如果所选区域内已存在合并单元格，则取消临时合并，否则临时合并
       */
      MERGE_OR_CLEAR(params) {
        const { $table } = params
        const cellAreas = $table.getCellAreas()
        const beenMerges = getBeenMerges(params)
        if (beenMerges.length) {
          $table.removeMergeCells(beenMerges)
        } else {
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
        }
      },
      /**
       * 如果启用 mouse-config.area 功能，临时合并区域范围内的单元格，不管是否存在已合并
       */
      MERGE_CELL(params) {
        const { $table } = params
        const { visibleData } = $table.getTableData()
        const { visibleColumn } = $table.getTableColumn()
        const cellAreas = $table.getCellAreas()
        handleClearMergeCells(params)
        if (cellAreas.some(({ rows, cols }) => rows.length === visibleData.length || cols.length === visibleColumn.length)) {
          if (vxetable.modal) {
            vxetable.modal.message({ message: vxetable.t('vxe.pro.area.mergeErr'), status: 'error', id: 'operErr' })
          }
          return
        }
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
      CLEAR_MERGE_CELL(params) {
        handleClearMergeCells(params)
      },
      /**
       * 清除所有单元格及表尾的临时合并状态
       */
      CLEAR_ALL_MERGE(params) {
        const { $table } = params
        $table.clearMergeCells()
        $table.clearMergeFooterItems()
      },
      /**
       * 编辑单元格
       */
      EDIT_CELL(params) {
        const { $table, row, column } = params
        $table.setActiveCell(row, column.property)
      },
      /**
       * 编辑行
       */
      EDIT_ROW(params) {
        const { $table, row } = params
        $table.setActiveRow(row)
      },
      /**
       * 插入数据
       */
      INSERT_ROW(params) {
        const { $table, menu } = params
        $table.insert(menu.params)
      },
      /**
       * 插入数据并激活编辑状态
       */
      INSERT_ACTIVED_ROW(params) {
        const { $table, menu, column } = params
        let args: any[] = menu.params || [] // [{}, 'field']
        $table.insert(args[0])
          .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
      },
      /**
       * 插入数据到指定位置
       */
      INSERT_AT_ROW(params) {
        const { $table, menu, row } = params
        if (row) {
          $table.insertAt(menu.params, row)
        }
      },
      /**
       * 插入数据到指定位置并激活编辑状态
       */
      INSERT_AT_ACTIVED_ROW(params) {
        const { $table, menu, row, column } = params
        if (row) {
          let args: any[] = menu.params || [] // [{}, 'field']
          $table.insertAt(args[0], row)
            .then(({ row }) => $table.setActiveCell(row, args[1] || column.property))
        }
      },
      /**
       * 移除行数据
       */
      DELETE_ROW(params) {
        const { $table, row } = params
        if (row) {
          $table.remove(row)
        }
      },
      /**
       * 移除复选框选中行数据
       */
      DELETE_CHECKBOX_ROW(params) {
        const { $table } = params
        $table.removeCheckboxRow()
      },
      /**
       * 移除所有行数据
       */
      DELETE_ALL(params) {
        const { $table } = params
        $table.remove()
      },
      /**
       * 清除排序条件
       */
      CLEAR_SORT(params) {
        const { $table } = params
        $table.clearSort()
      },
      /**
       * 按所选列的值升序
       */
      SORT_ASC(params) {
        const { $table, column } = params
        if (column) {
          $table.sort(column.property, 'asc')
        }
      },
      /**
       * 按所选列的值倒序
       */
      SORT_DESC(params) {
        const { $table, column } = params
        if (column) {
          $table.sort(column.property, 'desc')
        }
      },
      /**
       * 清除复选框选中列的筛选条件
       */
      CLEAR_FILTER(params) {
        const { $table, column } = params
        if (column) {
          $table.clearFilter(column)
        }
      },
      /**
       * 清除所有列筛选条件
       */
      CLEAR_ALL_FILTER(params) {
        const { $table } = params
        $table.clearFilter()
      },
      /**
       * 根据单元格值筛选
       */
      FILTER_CELL(params) {
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
      EXPORT_ROW(params) {
        const { $table, menu, row } = params
        if (row) {
          let opts = { data: [row] }
          $table.exportData(XEUtils.assign(opts, menu.params[0]))
        }
      },
      /**
       * 导出复选框选中行数据
       */
      EXPORT_CHECKBOX_ROW(params) {
        const { $table, menu } = params
        let opts = { data: $table.getCheckboxRecords() }
        $table.exportData(XEUtils.assign(opts, menu.params[0]))
      },
      /**
       * 导出所有行数据
       */
      EXPORT_ALL(params) {
        const { $table, menu } = params
        $table.exportData(menu.params)
      },
      /**
       * 打印所有行数据
       */
      PRINT_ALL(params) {
        const { $table, menu } = params
        $table.print(menu.params)
      },
      /**
       * 打印复选框选中行
       */
      PRINT_CHECKBOX_ROW(params) {
        const { $table, menu } = params
        let opts = { data: $table.getCheckboxRecords() }
        $table.print(XEUtils.assign(opts, menu.params))
      },
      /**
       * 打开查找功能
       */
      OPEN_FIND(params) {
        const { $table } = params
        $table.openFind()
      },
      /**
       * 打开替换功能
       */
      OPEN_REPLACE(params) {
        const { $table } = params
        $table.openReplace()
      },
      /**
       * 隐藏当前列
       */
      HIDDEN_COLUMN(params) {
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
      CLEAR_FIXED_COLUMN: handleFixedColumn(null),
      /**
       * 重置列的可视状态
       */
      RESET_COLUMN(params) {
        const { $table } = params
        $table.resetColumn({ visible: true, resizable: false })
      },
      /**
       * 重置列宽状态
       */
      RESET_RESIZABLE(params) {
        const { $table } = params
        $table.resetColumn({ visible: false, resizable: true })
      },
      /**
       * 重置列的所有状态
       */
      RESET_ALL(params) {
        const { $table } = params
        $table.resetColumn(true)
      }
    })
    
    interceptor.add('event.showMenu', handlePrivilegeEvent)
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
