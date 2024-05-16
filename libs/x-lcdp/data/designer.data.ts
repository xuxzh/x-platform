import { RhSafeAny } from '@x/base/model';
import { IPageSchema, XJsonSchemaOperationType } from '@x/lcdp/model';

/** 页面根节点key */
export const JSON_SCHEMA_ROOT_KEY = 'PAGE_KEY';
/** 子页面节点key */
export const JSON_SCHEMA_NODE_KEY = 'NODE_KEY';

// export const CHILD_CONTAINER_DISPLAY_NAME_MAPPED_DATA: Record<DesignerComponentType, string> = {
//   [DesignerComponentType.BasicDiv]: '子div'
// };

/** 默认最小高度
 * @description 对于`container`或`void`类型，需要设置最小高度
 */
export const DEFAULT_MIN_HEIGHT = '48px';

export const OMIT_FIELD_DATAS = ['select', 'expand', 'check'];

export const JSON_SCHEMA_OPERATION_TYPE_SET: XJsonSchemaOperationType[] = [
  'select',
  'delete',
  'copy',
  'node-edit',
  'drag',
];

/** 初始化默认JSON Schema数据 */
export function getInitialSchemaData(): IPageSchema {
  return {
    key: JSON_SCHEMA_ROOT_KEY,
    /** 请勿更改名称，会影响到大纲树的图标展示 */
    compType: 'home',
    displayName: '主设计页面',
    type: 'page',
    parent: null,
    children: [],
    /** // TODO:存放页面资源，字段名称需要修改 */
    'x-component-props': {},
    'x-component-styles': {
      position: 'relative',
      // FIXME: 根据主题动态设置背景色
      // background: 'white'
    },
    subPages: [],
  } as RhSafeAny;
}
