import { inject } from '@angular/core';
import { JSON_SCHEMA_OPERATION_TYPE_SET } from '@x/lcdp/data';
import { XJsonSchemaService } from '@x/lcdp/designer';
import {
  IPageSchema,
  XJsonSchemaOperationType,
  XJsonSchemaTriggerOrigin,
} from '@x/lcdp/model';
import { filter, Subscription } from 'rxjs';
/**
 * 用于订阅`jsonSchemaDataset`的数据变化
 * 设计器组件池中的组件请不要继承此类，而应该继承`RhBaseDesignerComponent `
 */
export class XSchemaDataBase {
  /** 忽略订阅的jsonschema操作类型 */
  ignoreOperationTypeSet: XJsonSchemaOperationType[] =
    JSON_SCHEMA_OPERATION_TYPE_SET;

  jsonSchemaSubscription!: Subscription;
  /** 设计器当前的JSON Schema数据 */
  jsonSchemaData!: IPageSchema;

  triggerOrigin: XJsonSchemaTriggerOrigin = null;

  jsonSchemaSer = inject(XJsonSchemaService);

  constructor() {
    this.subscribeJsonSchemaData();
  }

  subscribeJsonSchemaData() {
    if (this.jsonSchemaSer.isRuntime) {
      return;
    }
    this.jsonSchemaData = this.jsonSchemaSer.rootJsonSchemaDataset;
    this.jsonSchemaSubscription = this.jsonSchemaSer.jsonSchemaDataset$
      .pipe(filter(() => !this.jsonSchemaSer.isRuntime))
      .subscribe((data) => {
        if (
          this.ignoreOperationTypeSet.includes(
            this.jsonSchemaSer.jsonSchemaOperationType
          )
        ) {
          return;
        }
        this.jsonSchemaData = data;
      });
  }

  unsubscribeJsonSchemaData() {
    if (this.jsonSchemaSubscription) {
      this.jsonSchemaSubscription.unsubscribe();
    }
  }

  OnDestroy() {
    this.unsubscribeJsonSchemaData();
  }
}
