import VXETable from 'vxe-table'

export interface VXETablePluginStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * vxe-table context menu plugins.
 */
declare var VXETablePluginMenus: VXETablePluginStatic;

export default VXETablePluginMenus;