(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-menus", [], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.VXETablePluginMenus = mod.exports.default;
  }
})(this, function () {
  "use strict";

  exports.__esModule = true;

  var xe_utils_1 = require("xe-utils");

  var menuMap = {
    CLEAR_CELL: function CLEAR_CELL(_a) {
      var $table = _a.$table,
          row = _a.row,
          column = _a.column;

      if (row && column) {
        $table.clearData(row, column.property);
      }
    },
    CLEAR_ROW: function CLEAR_ROW(_a) {
      var $table = _a.$table,
          row = _a.row;

      if (row) {
        $table.clearData(row);
      }
    },
    CLEAR_SELECTION_ROW: function CLEAR_SELECTION_ROW(_a) {
      var $table = _a.$table;
      $table.clearData($table.getSelectRecords());
    },
    CLEAR_ALL: function CLEAR_ALL(_a) {
      var $table = _a.$table;
      $table.clearData();
    },
    REVERT_CELL: function REVERT_CELL(_a) {
      var $table = _a.$table,
          row = _a.row,
          column = _a.column;

      if (row && column) {
        $table.revertData(row, column.property);
      }
    },
    REVERT_ROW: function REVERT_ROW(_a) {
      var $table = _a.$table,
          row = _a.row;

      if (row) {
        $table.revertData(row);
      }
    },
    REVERT_SELECTION_ROW: function REVERT_SELECTION_ROW(_a) {
      var $table = _a.$table;
      $table.revertData($table.getSelectRecords());
    },
    REVERT_ALL: function REVERT_ALL(_a) {
      var $table = _a.$table;
      $table.revertData();
    },
    INSERT_ROW: function INSERT_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu;
      $table.insert(menu.params);
    },
    INSERT_ACTIVED_ROW: function INSERT_ACTIVED_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu,
          column = _a.column;
      var args = menu.params || [];
      $table.insert(args[0]).then(function (_a) {
        var row = _a.row;
        return $table.setActiveCell(row, args[1] || column.property);
      });
    },
    INSERT_AT_ROW: function INSERT_AT_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu,
          row = _a.row;

      if (row) {
        $table.insertAt(menu.params, row);
      }
    },
    INSERT_AT_ACTIVED_ROW: function INSERT_AT_ACTIVED_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu,
          row = _a.row,
          column = _a.column;

      if (row) {
        var args_1 = menu.params || [];
        $table.insertAt(args_1[0], row).then(function (_a) {
          var row = _a.row;
          return $table.setActiveCell(row, args_1[1] || column.property);
        });
      }
    },
    DELETE_ROW: function DELETE_ROW(_a) {
      var $table = _a.$table,
          row = _a.row;

      if (row) {
        $table.remove(row);
      }
    },
    DELETE_SELECTION_ROW: function DELETE_SELECTION_ROW(_a) {
      var $table = _a.$table;
      $table.removeSelecteds();
    },
    DELETE_ALL: function DELETE_ALL(_a) {
      var $table = _a.$table;
      $table.remove();
    },
    CLEAR_SORT: function CLEAR_SORT(_a) {
      var $table = _a.$table;
      $table.clearSort();
    },
    SORT_ASC: function SORT_ASC(_a, evnt) {
      var $table = _a.$table,
          column = _a.column;

      if (column) {
        $table.triggerSortEvent(evnt, column, 'asc');
      }
    },
    SORT_DESC: function SORT_DESC(_a, evnt) {
      var $table = _a.$table,
          column = _a.column;

      if (column) {
        $table.triggerSortEvent(evnt, column, 'desc');
      }
    },
    CLEAR_FILTER: function CLEAR_FILTER(_a) {
      var $table = _a.$table,
          column = _a.column;

      if (column) {
        $table.clearFilter(column.property);
      }
    },
    CLEAR_ALL_FILTER: function CLEAR_ALL_FILTER(_a) {
      var $table = _a.$table;
      $table.clearFilter();
    },
    FILTER_CELL: function FILTER_CELL(_a) {
      var $table = _a.$table,
          row = _a.row,
          column = _a.column;

      if (row && column) {
        var property_1 = column.property;
        $table.filter(property_1).then(function (options) {
          if (options.length) {
            var option = options[0];
            option.data = xe_utils_1["default"].get(row, property_1);
            option.checked = true;
          }
        }).then(function () {
          return $table.updateData();
        });
      }
    },
    EXPORT_ROW: function EXPORT_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu,
          row = _a.row;

      if (row) {
        var opts = {
          data: [row]
        };
        $table.exportCsv(menu.params ? xe_utils_1["default"].assign(opts, menu.params[0]) : opts);
      }
    },
    EXPORT_SELECTION_ROW: function EXPORT_SELECTION_ROW(_a) {
      var $table = _a.$table,
          menu = _a.menu;
      var opts = {
        data: $table.getSelectRecords()
      };
      $table.exportCsv(menu.params ? xe_utils_1["default"].assign(opts, menu.params[0]) : opts);
    },
    EXPORT_ALL: function EXPORT_ALL(_a) {
      var $table = _a.$table;
      $table.exportCsv();
    },
    HIDDEN_COLUMN: function HIDDEN_COLUMN(_a) {
      var $table = _a.$table,
          column = _a.column;

      if (column) {
        $table.hideColumn();
      }
    },
    RESET_COLUMN: function RESET_COLUMN(_a) {
      var $table = _a.$table;
      $table.resetCustoms();
    },
    RESET_RESIZABLE: function RESET_RESIZABLE(_a) {
      var $table = _a.$table;
      $table.resetResizable();
    },
    RESET_ALL: function RESET_ALL(_a) {
      var $table = _a.$table;
      $table.resetAll();
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
        item.disabled = !column;

        if (!item.disabled) {
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


  exports.VXETablePluginMenus = {
    install: function install(xtable) {
      xtable.interceptor.add('event.show_menu', handlePrivilegeEvent);
      xtable.menus.mixin(menuMap);
    }
  };

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(exports.VXETablePluginMenus);
  }

  exports["default"] = exports.VXETablePluginMenus;
});