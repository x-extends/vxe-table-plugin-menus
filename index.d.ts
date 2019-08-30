import VXETable from 'vxe-table'

export interface VXETablePluginStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * 基于 vxe-table 表格的增强插件，提供实用的快捷菜单集
 */
declare var VXETablePluginMenus: VXETablePluginStatic;

export default VXETablePluginMenus;