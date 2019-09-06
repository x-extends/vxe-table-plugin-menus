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
})(this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.VXETablePluginMenus = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  var menuMap = {
    CLEAR_CELL: function CLEAR_CELL(_ref) {
      var $table = _ref.$table,
          row = _ref.row,
          column = _ref.column;

      if (row && column) {
        $table.clearData(row, column.property);
      }
    },
    CLEAR_ROW: function CLEAR_ROW(_ref2) {
      var $table = _ref2.$table,
          row = _ref2.row;

      if (row) {
        $table.clearData(row);
      }
    },
    CLEAR_SELECTION_ROW: function CLEAR_SELECTION_ROW(_ref3) {
      var $table = _ref3.$table;
      $table.clearData($table.getSelectRecords());
    },
    CLEAR_ALL: function CLEAR_ALL(_ref4) {
      var $table = _ref4.$table;
      $table.clearData();
    },
    REVERT_CELL: function REVERT_CELL(_ref5) {
      var $table = _ref5.$table,
          row = _ref5.row,
          column = _ref5.column;

      if (row && column) {
        $table.revertData(row, column.property);
      }
    },
    REVERT_ROW: function REVERT_ROW(_ref6) {
      var $table = _ref6.$table,
          row = _ref6.row;

      if (row) {
        $table.revertData(row);
      }
    },
    REVERT_SELECTION_ROW: function REVERT_SELECTION_ROW(_ref7) {
      var $table = _ref7.$table;
      $table.revertData($table.getSelectRecords());
    },
    REVERT_ALL: function REVERT_ALL(_ref8) {
      var $table = _ref8.$table;
      $table.revertData();
    },
    INSERT_ROW: function INSERT_ROW(_ref9) {
      var $table = _ref9.$table,
          menu = _ref9.menu;
      $table.insert(menu.params);
    },
    INSERT_ACTIVED_ROW: function INSERT_ACTIVED_ROW(_ref10) {
      var $table = _ref10.$table,
          menu = _ref10.menu,
          column = _ref10.column;
      var args = menu.params || [];
      $table.insert(args[0]).then(function (_ref11) {
        var row = _ref11.row;
        return $table.setActiveCell(row, args[1] || column.property);
      });
    },
    INSERT_AT_ROW: function INSERT_AT_ROW(_ref12) {
      var $table = _ref12.$table,
          menu = _ref12.menu,
          row = _ref12.row;

      if (row) {
        $table.insertAt(menu.params, row);
      }
    },
    INSERT_AT_ACTIVED_ROW: function INSERT_AT_ACTIVED_ROW(_ref13) {
      var $table = _ref13.$table,
          menu = _ref13.menu,
          row = _ref13.row,
          column = _ref13.column;

      if (row) {
        var args = menu.params || [];
        $table.insertAt(args[0], row).then(function (_ref14) {
          var row = _ref14.row;
          return $table.setActiveCell(row, args[1] || column.property);
        });
      }
    },
    DELETE_ROW: function DELETE_ROW(_ref15) {
      var $table = _ref15.$table,
          row = _ref15.row;

      if (row) {
        $table.remove(row);
      }
    },
    DELETE_SELECTION_ROW: function DELETE_SELECTION_ROW(_ref16) {
      var $table = _ref16.$table;
      $table.removeSelecteds();
    },
    DELETE_ALL: function DELETE_ALL(_ref17) {
      var $table = _ref17.$table;
      $table.remove();
    },
    CLEAR_SORT: function CLEAR_SORT(_ref18) {
      var $table = _ref18.$table;
      $table.clearSort();
    },
    SORT_ASC: function SORT_ASC(_ref19) {
      var $table = _ref19.$table,
          column = _ref19.column;

      if (column) {
        $table.sort(column.property, 'asc');
      }
    },
    SORT_DESC: function SORT_DESC(_ref20) {
      var $table = _ref20.$table,
          column = _ref20.column;

      if (column) {
        $table.sort(column.property, 'desc');
      }
    },
    CLEAR_FILTER: function CLEAR_FILTER(_ref21) {
      var $table = _ref21.$table,
          column = _ref21.column;

      if (column) {
        $table.clearFilter(column.property);
      }
    },
    CLEAR_ALL_FILTER: function CLEAR_ALL_FILTER(_ref22) {
      var $table = _ref22.$table;
      $table.clearFilter();
    },
    FILTER_CELL: function FILTER_CELL(_ref23) {
      var $table = _ref23.$table,
          row = _ref23.row,
          column = _ref23.column;

      if (row && column) {
        var property = column.property;
        $table.filter(property).then(function (options) {
          if (options.length) {
            var option = options[0];
            option.data = _xeUtils["default"].get(row, property);
            option.checked = true;
          }
        }).then(function () {
          return $table.updateData();
        });
      }
    },
    EXPORT_ROW: function EXPORT_ROW(_ref24) {
      var $table = _ref24.$table,
          menu = _ref24.menu,
          row = _ref24.row;

      if (row) {
        var opts = {
          data: [row]
        };
        $table.exportCsv(menu.params ? _xeUtils["default"].assign(opts, menu.params[0]) : opts);
      }
    },
    EXPORT_SELECTION_ROW: function EXPORT_SELECTION_ROW(_ref25) {
      var $table = _ref25.$table,
          menu = _ref25.menu;
      var opts = {
        data: $table.getSelectRecords()
      };
      $table.exportCsv(menu.params ? _xeUtils["default"].assign(opts, menu.params[0]) : opts);
    },
    EXPORT_ALL: function EXPORT_ALL(_ref26) {
      var $table = _ref26.$table;
      $table.exportCsv();
    },
    HIDDEN_COLUMN: function HIDDEN_COLUMN(_ref27) {
      var $table = _ref27.$table,
          column = _ref27.column;

      if (column) {
        $table.hideColumn();
      }
    },
    RESET_COLUMN: function RESET_COLUMN(_ref28) {
      var $table = _ref28.$table;
      $table.resetCustoms();
    },
    RESET_RESIZABLE: function RESET_RESIZABLE(_ref29) {
      var $table = _ref29.$table;
      $table.resetResizable();
    },
    RESET_ALL: function RESET_ALL(_ref30) {
      var $table = _ref30.$table;
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

  var VXETablePluginMenus = {
    install: function install(VXETable) {
      VXETable.interceptor.add('event.show_menu', handlePrivilegeEvent);
      VXETable.menus.mixin(menuMap);
    }
  };
  _exports.VXETablePluginMenus = VXETablePluginMenus;

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginMenus);
  }

  var _default = VXETablePluginMenus;
  _exports["default"] = _default;
});