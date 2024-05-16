import { DesignerComponentType, IComponentFieldSetting } from '@x/lcdp/model';

/** 组件和对应的组件配置数据映射 */
export const COMPONENT_FIELD_SETTING_MAPPED: Record<
  DesignerComponentType,
  IComponentFieldSetting[]
> = {
  // 按钮
  [DesignerComponentType.Div]: [],
  [DesignerComponentType.Btn]: [],
  // FIXME:
  [DesignerComponentType.Void]: [],
  [DesignerComponentType.SubPage]: [],
};
