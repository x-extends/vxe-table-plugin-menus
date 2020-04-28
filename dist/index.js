(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-menus", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginMenus = mod.exports.default;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginMenus = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  /* eslint-disable no-unused-vars */

  /* eslint-enable no-unused-vars */
  function handleFixedColumn(fixed) {
    return function (params) {
      var $table = params.$table,
          column = params.column;

      _xeUtils["default"].eachTree([column], function (column) {
        column.fixed = fixed;
      });

      $table.refreshColumn();
    };
  }

  var menuMap = {
    /**
     * 清除单元格数据的值
     */
    CLEAR_CELL: function CLEAR_CELL(params) {
      var $table = params.$table,
          row = params.row,
          column = params.column;

      if (row && column) {
        $table.clearData(row, column.property);
      }
    },

    /**
     * 清除行数据的值
     */
    CLEAR_ROW: function CLEAR_ROW(params) {
      var $table = params.$table,
          row = params.row;

      if (row) {
        $table.clearData(row);
      }
    },

    /**
     * 清除选中行数据的值
     */
    CLEAR_SELECTED_ROW: function CLEAR_SELECTED_ROW(params) {
      var $table = params.$table;
      $table.clearData($table.getCheckboxRecords());
    },

    /**
     * 清除所有数据的值
     */
    CLEAR_ALL: function CLEAR_ALL(params) {
      var $table = params.$table;
      $table.clearData();
    },

    /**
     * 还原单元格数据的值
     */
    REVERT_CELL: function REVERT_CELL(params) {
      var $table = params.$table,
          row = params.row,
          column = params.column;

      if (row && column) {
        $table.revertData(row, column.property);
      }
    },

    /**
     * 还原行数据的值
     */
    REVERT_ROW: function REVERT_ROW(params) {
      var $table = params.$table,
          row = params.row;

      if (row) {
        $table.revertData(row);
      }
    },

    /**
     * 还原选中行数据的值
     */
    REVERT_SELECTED_ROW: function REVERT_SELECTED_ROW(params) {
      var $table = params.$table;
      $table.revertData($table.getCheckboxRecords());
    },

    /**
     * 还原所有数据的值
     */
    REVERT_ALL: function REVERT_ALL(params) {
      var $table = params.$table;
      $table.revertData();
    },

    /**
     * 插入数据
     */
    INSERT_ROW: function INSERT_ROW(params) {
      var $table = params.$table,
          menu = params.menu;
      $table.insert(menu.params);
    },

    /**
     * 插入数据并激活编辑状态
     */
    INSERT_ACTIVED_ROW: function INSERT_ACTIVED_ROW(params) {
      var $table = params.$table,
          menu = params.menu,
          column = params.column;
      var args = menu.params || [];
      $table.insert(args[0]).then(function (_ref) {
        var row = _ref.row;
        return $table.setActiveCell(row, args[1] || column.property);
      });
    },

    /**
     * 插入数据到指定位置
     */
    INSERT_AT_ROW: function INSERT_AT_ROW(params) {
      var $table = params.$table,
          menu = params.menu,
          row = params.row;

      if (row) {
        $table.insertAt(menu.params, row);
      }
    },

    /**
     * 插入数据到指定位置并激活编辑状态
     */
    INSERT_AT_ACTIVED_ROW: function INSERT_AT_ACTIVED_ROW(params) {
      var $table = params.$table,
          menu = params.menu,
          row = params.row,
          column = params.column;

      if (row) {
        var args = menu.params || [];
        $table.insertAt(args[0], row).then(function (_ref2) {
          var row = _ref2.row;
          return $table.setActiveCell(row, args[1] || column.property);
        });
      }
    },

    /**
     * 移除行数据
     */
    DELETE_ROW: function DELETE_ROW(params) {
      var $table = params.$table,
          row = params.row;

      if (row) {
        $table.remove(row);
      }
    },

    /**
     * 移除选中行数据
     */
    DELETE_SELECTED_ROW: function DELETE_SELECTED_ROW(params) {
      var $table = params.$table;
      $table.removeCheckboxRow();
    },

    /**
     * 移除所有行数据
     */
    DELETE_ALL: function DELETE_ALL(params) {
      var $table = params.$table;
      $table.remove();
    },

    /**
     * 清除排序条件
     */
    CLEAR_SORT: function CLEAR_SORT(params) {
      var $table = params.$table;
      $table.clearSort();
    },

    /**
     * 按所选列的值升序
     */
    SORT_ASC: function SORT_ASC(params) {
      var $table = params.$table,
          column = params.column;

      if (column) {
        $table.sort(column.property, 'asc');
      }
    },

    /**
     * 按所选列的值倒序
     */
    SORT_DESC: function SORT_DESC(params) {
      var $table = params.$table,
          column = params.column;

      if (column) {
        $table.sort(column.property, 'desc');
      }
    },

    /**
     * 清除选中列的筛选条件
     */
    CLEAR_FILTER: function CLEAR_FILTER(params) {
      var $table = params.$table,
          column = params.column;

      if (column) {
        $table.clearFilter(column);
      }
    },

    /**
     * 清除所有列筛选条件
     */
    CLEAR_ALL_FILTER: function CLEAR_ALL_FILTER(params) {
      var $table = params.$table;
      $table.clearFilter();
    },

    /**
     * 根据单元格值筛选
     */
    FILTER_CELL: function FILTER_CELL(params) {
      var $table = params.$table,
          row = params.row,
          column = params.column;

      if (row && column) {
        var property = column.property,
            filters = column.filters;

        if (filters.length) {
          var option = filters[0];
          option.data = _xeUtils["default"].get(row, property);
          option.checked = true;
          $table.updateData();
        }
      }
    },

    /**
     * 导出行数据
     */
    EXPORT_ROW: function EXPORT_ROW(params) {
      var $table = params.$table,
          menu = params.menu,
          row = params.row;

      if (row) {
        var opts = {
          data: [row]
        };
        $table.exportData(_xeUtils["default"].assign(opts, menu.params[0]));
      }
    },

    /**
     * 导出选中行数据
     */
    EXPORT_SELECTED_ROW: function EXPORT_SELECTED_ROW(params) {
      var $table = params.$table,
          menu = params.menu;
      var opts = {
        data: $table.getCheckboxRecords()
      };
      $table.exportData(_xeUtils["default"].assign(opts, menu.params[0]));
    },

    /**
     * 导出所有行数据
     */
    EXPORT_ALL: function EXPORT_ALL(params) {
      var $table = params.$table,
          menu = params.menu;
      $table.exportData(menu.params);
    },

    /**
     * 打印所有行数据
     */
    PRINT_ALL: function PRINT_ALL(params) {
      var $table = params.$table,
          menu = params.menu;
      $table.print(menu.params);
    },

    /**
     * 打印选中行
     */
    PRINT_SELECTED_ROW: function PRINT_SELECTED_ROW(params) {
      var $table = params.$table,
          menu = params.menu;
      var opts = {
        data: $table.getCheckboxRecords()
      };
      $table.print(_xeUtils["default"].assign(opts, menu.params));
    },

    /**
     * 隐藏当前列
     */
    HIDDEN_COLUMN: function HIDDEN_COLUMN(params) {
      var $table = params.$table,
          column = params.column;

      if (column) {
        $table.hideColumn(column);
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
    RESET_COLUMN: function RESET_COLUMN(params) {
      var $table = params.$table;
      $table.resetColumn({
        visible: true,
        resizable: false
      });
    },

    /**
     * 重置列宽状态
     */
    RESET_RESIZABLE: function RESET_RESIZABLE(params) {
      var $table = params.$table;
      $table.resetColumn({
        visible: false,
        resizable: true
      });
    },

    /**
     * 重置列的所有状态
     */
    RESET_ALL: function RESET_ALL(params) {
      var $table = params.$table;
      $table.resetColumn(true);
    }
  };

  function checkPrivilege(item, params) {
    var code = item.code;
    var columns = params.columns,
        column = params.column;

    switch (code) {
      case 'CLEAR_SORT':
        item.disabled = !columns.some(function (column) {
          return column.sortable && column.order;
        });
        break;

      case 'CLEAR_ALL_FILTER':
        item.disabled = !columns.some(function (column) {
          return column.filters && column.filters.some(function (option) {
            return option.checked;
          });
        });
        break;

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
        item.disabled = !column;

        if (column) {
          var isChildCol = !!column.parentId;

          switch (code) {
            case 'SORT_ASC':
            case 'SORT_DESC':
              item.disabled = !column.sortable;
              break;

            case 'FILTER_CELL':
            case 'CLEAR_FILTER':
              item.disabled = !column.filters || !column.filters.length;

              if (!item.disabled) {
                switch (code) {
                  case 'CLEAR_FILTER':
                    item.disabled = !column.filters.some(function (option) {
                      return option.checked;
                    });
                    break;
                }
              }

              break;

            case 'FIXED_LEFT_COLUMN':
              item.disabled = isChildCol || column.fixed === 'left';
              break;

            case 'FIXED_RIGHT_COLUMN':
              item.disabled = isChildCol || column.fixed === 'right';
              break;

            case 'CLEAR_FIXED_COLUMN':
              item.disabled = isChildCol || !column.fixed;
              break;
          }
        }

        break;
    }
  }

  function handlePrivilegeEvent(params) {
    params.options.forEach(function (list) {
      list.forEach(function (item) {
        checkPrivilege(item, params);

        if (item.children) {
          item.children.forEach(function (child) {
            checkPrivilege(child, params);
          });
        }
      });
    });
  }
  /**
   * 基于 vxe-table 表格的增强插件，提供实用的快捷菜单集
   */


  var VXETablePluginMenus = {
    install: function install(_ref3) {
      var interceptor = _ref3.interceptor,
          menus = _ref3.menus;
      interceptor.add('event.showMenu', handlePrivilegeEvent);
      menus.mixin(menuMap);
    }
  };
  _exports.VXETablePluginMenus = VXETablePluginMenus;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginMenus);
  }

  var _default = VXETablePluginMenus;
  _exports["default"] = _default;
});