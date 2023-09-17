import { VXETableCore } from 'vxe-table'

interface VXETablePluginMenusOptions {
  copy?: (content: string | number) => boolean;
}

/**
 * 基于 vxe-table 表格的扩展插件，提供实用的快捷菜单配置
 */
export declare const VXETablePluginMenus: {
  install (vxetable: VXETableCore, options?: VXETablePluginMenusOptions): void
}

export default VXETablePluginMenus
