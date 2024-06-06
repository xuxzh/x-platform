import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { RhPageResources } from './page.model';
import { TemplateRef } from '@angular/core';
import { RhExtensionPack } from './extension.model';
import { RhSafeAny } from '@x/base/model';
import { IPageSchema, XTemplateSchemaType } from '../designer.model';

export type RhPageResourceSelectTreeNodeOptions = NzTreeNodeOptions & {
  children?: RhPageResourceSelectTreeNodeOptions[] | undefined;
  conflicting?: boolean;
  source: RhSafeAny;
  resourceType: keyof RhPageResources;
  mode?: 'add' | 'replace';
};

export type RhPageResourceSelectTreeNode = NzTreeNode & {
  origin: RhPageResourceSelectTreeNodeOptions;
  children: RhPageResourceSelectTreeNode[] | undefined;
  parentNode: RhPageResourceSelectTreeNode | undefined;
};

export type RhPageTemplates = Record<string, TemplateRef<RhSafeAny>>;

/** json数据类型 */
export type RhJsonDataType = 'page' | 'extension' | 'template';
/** json数据在不同类型下对应的格式 */
export type RhJsonDataFormat =
  | IPageSchema
  | RhExtensionPack
  | XTemplateSchemaType;
