"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginMenus = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

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
    $table.insertAt.apply($table, menu.params || []);
  },
  INSERT_ACTIVED_ROW: function INSERT_ACTIVED_ROW(_ref10) {
    var $table = _ref10.$table,
        menu = _ref10.menu;
    var args = menu.params || [];
    $table.insertAt.apply($table, args[0] || []).then(function (_ref11) {
      var row = _ref11.row;
      return args[1] ? $table.setActiveRow(row) : $table.setActiveCell.apply($table, [row].concat(args[1]));
    });
  },
  DELETE_ROW: function DELETE_ROW(_ref12) {
    var $table = _ref12.$table,
        row = _ref12.row;

    if (row) {
      $table.remove(row);
    }
  },
  DELETE_SELECTION_ROW: function DELETE_SELECTION_ROW(_ref13) {
    var $table = _ref13.$table;
    $table.removeSelecteds();
  },
  DELETE_ALL: function DELETE_ALL(_ref14) {
    var $table = _ref14.$table;
    $table.remove();
  },
  EXPORT_ROW: function EXPORT_ROW(_ref15) {
    var $table = _ref15.$table,
        menu = _ref15.menu,
        row = _ref15.row;

    if (row) {
      var opts = {
        data: [row]
      };
      $table.exportCsv(menu.params ? _xeUtils["default"].assign(opts, menu.params[0]) : opts);
    }
  },
  EXPORT_SELECTION_ROW: function EXPORT_SELECTION_ROW(_ref16) {
    var $table = _ref16.$table,
        menu = _ref16.menu;
    var opts = {
      data: $table.getSelectRecords()
    };
    $table.exportCsv(menu.params ? _xeUtils["default"].assign(opts, menu.params[0]) : opts);
  },
  EXPORT_ALL: function EXPORT_ALL(_ref17) {
    var $table = _ref17.$table;
    $table.exportCsv();
  },
  HIDDEN_COLUMN: function HIDDEN_COLUMN(_ref18) {
    var $table = _ref18.$table,
        column = _ref18.column;

    if (column) {
      $table.hideColumn();
    }
  },
  RESET_COLUMN: function RESET_COLUMN(_ref19) {
    var $table = _ref19.$table;
    $table.resetCustoms();
  },
  RESET_RESIZABLE: function RESET_RESIZABLE(_ref20) {
    var $table = _ref20.$table;
    $table.resetResizable();
  },
  RESET_ALL: function RESET_ALL(_ref21) {
    var $table = _ref21.$table;
    $table.resetAll();
  }
};
var VXETablePluginMenus = {
  install: function install(_ref22) {
    var menus = _ref22.menus;
    menus.mixin(menuMap);
  }
};
exports.VXETablePluginMenus = VXETablePluginMenus;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginMenus);
}

var _default = VXETablePluginMenus;
exports["default"] = _default;