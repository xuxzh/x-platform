import { Subject } from 'rxjs';
import { RhPageProps } from './page.model';
import * as rxjs from 'rxjs';
import * as operators from 'rxjs/operators';
import * as lodash from 'lodash';
import * as datefns from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//import { ArrayHelper, MsgHelper, ObjectHelper, RhNumberHelper } from "../utils";
//import { RhApiConfigService } from "../config";
import { RhAbstractComponent } from './base.model';
import { RhEvent, RhEventHandler } from './event.model';
import { RhOpHandlersDataset } from './handler.model';
import {
  RhOperation,
  RhOperationKey,
  RhOperationsDataset,
} from './operation.model';
import { RhModelField } from './model-field.model';
import { EXTENSION_EVENT_CHANNEL } from './extension.model';
import {
  RhConvertHandlersGroup,
  RhConverter,
  RhConverterHandlersDataset,
  RhConverterKey,
  RhConvertersDataset,
} from './converter.model';
import {
  RhInstanceAuthority,
  RhInstanceAuthorityRegistration,
} from './authority.model';
import { TemplateRef } from '@angular/core';
import { RhPageTemplates } from './extra.model';
import { RhSafeAny, WithNil } from '@x/base/model';
import { IComponentSchema, IPageSchema } from '../designer.model';

/** 局部空间 */
export class RhLocalSpace<T, D> {
  get d() {
    return this.R.dataset;
  }

  get c() {
    return this.R.schema;
  }

  get hostData() {
    return this.host?.rhHostData;
  }

  get extraData() {
    return this.host?.rhExtraData;
  }

  /** 附加信息 */
  public message?: RhSafeAny;

  constructor(
    /** 要操作的目标 */
    public target: T,
    /** 宿主组件 */
    public host: WithNil<RhAbstractComponent<RhSafeAny>>,
    /** 运行环境runtime */
    public R: RhAbstractRuntime<D>,
    /** 局部空间的创造者 */
    public schema: WithNil<IComponentSchema>,
    /** 事件对象 */
    public ev: WithNil<RhEvent>
  ) {}
}
/** 局部空间简写 */
export type LocalSpace = RhLocalSpace<RhSafeAny, RhSafeAny>;

/** 脚本空间中的脚本格式定义 */
export type RhFormattedScript = ($: LocalSpace) => RhSafeAny;

/** json类型。page表示页面，extension表示扩展包，tmp表示临时空间（比如手动创建的子runtime、直接传入json的预览等情形下） */
export type RhSchemaType = 'page' | 'extension' | 'tmp';

/** 运行环境 */
export abstract class RhAbstractRuntime<D> {
  /** 代理池。用于管理动态内容使用的对应数据，当数据发生变更时，通知对应组件 */
  private proxyPools: Map<string, Subject<RhSafeAny>> = new Map();
  /** 数据集代理对象 */
  private datasetProxy: WithNil<D>;
  /** 数据订阅总线 */
  private dataSubscribePool: Map<string, Map<string, Subject<RhSafeAny>>> =
    new Map();
  /** 关联的宿主 */
  private host: RhSafeAny;
  /** 关联的页面配置 */
  private page: WithNil<IPageSchema>;
  /** 实例集合 */
  private instances: Map<string, RhAbstractComponent<RhSafeAny>> = new Map();
  /** 数据集 */
  private _dataset: WithNil<D>;
  /** 父级运行环境 */
  protected parent?: RhAbstractRuntime<RhSafeAny>;
  /** 是否停工状态 */
  public disabled = false;
  /** 被权限管控的项列表 */
  private controlledItems: Record<string, RhInstanceAuthority> = {};
  /** 外部传入的自定义模板集合 */
  private customTemplateRefs: Map<string, TemplateRef<RhSafeAny>> = new Map();
  /** json类型，页面、扩展包、临时生成的。默认为临时 */
  private _schemaType: RhSchemaType = 'tmp';

  /** 页面json的原始备份 */
  private _backup!: IPageSchema;

  get schemaType() {
    return this._schemaType;
  }

  get schema() {
    return this.page;
  }
  get dataset() {
    return this.datasetProxy;
  }

  private _routePath: string | undefined;
  public readonly routePath$ = new Subject<string | undefined>();

  public get routePath() {
    return this._routePath;
  }
  public set routePath(path: string | undefined) {
    this._routePath = path;
    this.routePath$.next(path);
  }
  /** 动态（弹出）叠加显示的内容。正常来讲，是弹窗、抽屉等弹出的内容。预先不渲染。 */
  dynamicVisibleContents: IComponentSchema[] = [];

  abstract lodash: typeof lodash;
  abstract rxjs: typeof rxjs;
  abstract operators: typeof operators;
  abstract datefns: typeof datefns;
  // abstract screenfull: typeof screenfull;
  // abstract go: typeof go;
  // abstract echarts: RhSafeAny;
  abstract MsgHelper: RhSafeAny;
  abstract ObjectHelper: RhSafeAny;
  abstract NumberHelper: RhSafeAny;
  abstract ArrayHelper: RhSafeAny;
  abstract FunctionHelper: RhSafeAny;
  abstract FileHelper: RhSafeAny;
  // abstract FlowchartHelper: RhSafeAny;
  abstract DateHelper: RhSafeAny;
  abstract TreeHelper: RhSafeAny;
  // abstract I18nHelper: RhSafeAny;
  abstract apiService: RhSafeAny;
  abstract storageService: RhSafeAny;
  abstract appConfigService: RhSafeAny;
  abstract displayHelper: RhSafeAny;
  abstract opHandlers: RhOpHandlersDataset;
  abstract converterHandlers: RhConverterHandlersDataset;
  abstract operations: RhOperationsDataset;
  abstract converters: RhConvertersDataset;
  abstract http: HttpClient;
  abstract router: Router;
  // abstract customContents: RhSafeAny;

  /** 启用断点调试功能 */
  public enabledDebugger = false;
  /** 设置断点 */
  public setDebugger: RhFormattedScript = () => {
    //
  };

  constructor() {
    this.createDebuggerSetter();
  }

  /** 创建断点设置器。需要手动创建断点函数，直接代码书写的debugger会在打包的时候被移除，导致断点不生效 */
  private createDebuggerSetter() {
    this.setDebugger = this._parseFormattedScript('debugger');
  }

  /** 将当前runtime与目标页面建立连接 */
  public link(host: RhSafeAny, page: IPageSchema, type: RhSchemaType) {
    if (this.disabled) return;
    this.host = host;
    this._backup = JSON.parse(JSON.stringify(page));
    this.page = page;
    this._schemaType = type;
    if (!page['x-component-props'])
      page['x-component-props'] = new RhPageProps();
    this._dataset = this.initDataset(
      Array.from(Object.values(this.page['x-component-props']?.['variables'])),
      this.createLocalSpace(null)
    ) as RhSafeAny;
    this.initDatasetProxy(this._dataset);
  }
  /** 获取备份的页面数据 */
  get backupPageData() {
    return this._backup;
  }
  /** 获取页面key */
  get pageKey() {
    return this.page?.['pageKey'];
  }
  /** 添加实例 */
  addInstance(key: string, instance: RhAbstractComponent<RhSafeAny>) {
    this.instances.set(key, instance);
  }
  /** 移除实例 */
  removeInstance(key: string) {
    this.instances.delete(key);
  }
  /** 查找实例 */
  findInstance(key: string) {
    return this.instances.get(key);
  }
  /** 从页面json树中递归遍历查找目标节点 */
  findComponentSchema(
    key: string,
    root: IComponentSchema = this.page as RhSafeAny,
    subPagesFirst = false
  ): IComponentSchema | null {
    if (!root) return null;
    if (root.key === key) return root;
    const list =
      root.type == 'page'
        ? subPagesFirst
          ? [...root.children, ...(root['subPages'] || [])]
          : [...root.children, ...(root['subPages'] || [])]
        : root.children;
    if (list && list.length > 0) {
      let result = null;
      this.lodash.forEach(list, (item) => {
        result = this.findComponentSchema(key, item, subPagesFirst);
        if (result) return false;
        return true;
      });
      return result;
    }
    return null;
  }
  /** 显示可见动态内容 */
  showDynamicVisibleContent(node: IComponentSchema) {
    //const node = this.findComponentSchema(key, this.schema as RhPage, true);
    if (node) {
      const index = this.dynamicVisibleContents.findIndex(
        (item) => item.key == node.key
      );
      if (index != -1) this.dynamicVisibleContents.splice(index, 1, node);
      else this.dynamicVisibleContents.push(node);
      this.dynamicVisibleContents = [...this.dynamicVisibleContents];
    }
  }
  /** 关闭显示内容 */
  hidDynamicVisibleContent(key: string) {
    const index = this.dynamicVisibleContents.findIndex(
      (item) => item.key == key
    );
    if (index != -1) this.dynamicVisibleContents.splice(index, 1);
  }

  /** 初始化数据代理 */
  private initDatasetProxy(dataset: RhSafeAny) {
    this.datasetProxy = new Proxy(dataset, {
      set: (target, p, value, receiver) => {
        const subject = this.proxyPools.get(p as RhSafeAny);
        if (subject) {
          subject.next(value);
        }
        return Reflect.set(target, p, value, receiver);
      } /* ,
      defineProperty: (target, p, attributes) => {
        const subject = this.proxyPools.get(p as RhSafeAny);
        if (subject) {
          subject.next(target[p]);
        }
        return Reflect.defineProperty(target, p, attributes);
      } */,
    }) as RhSafeAny;
  }
  /** 创建局部空间 */
  createLocalSpace(
    target: RhSafeAny,
    ev: WithNil<RhEvent> = null,
    host: WithNil<RhAbstractComponent<RhSafeAny>> = null,
    schema: WithNil<IComponentSchema> = null
  ): RhLocalSpace<RhSafeAny, RhSafeAny> {
    return new RhLocalSpace(target, host, this, schema, ev);
  }
  /** 创建操作 */
  createOperation(op: RhOperationKey, params: Partial<RhOperation>) {
    const cls = this.operations[op];
    if (!cls) throw `操作【${op}】未注册，无法创建！`;
    const operation = new cls();
    this.__copy(operation, [params], false);
    return operation;
  }
  /** 创建转换器 */
  createConverter(converterKey: RhConverterKey, params: Partial<RhConverter>) {
    const cls = this.converters[converterKey];
    if (!cls) throw `转换器【${converterKey}】未注册，无法创建！`;
    const converter = new cls();
    this.__copy(converter, [params], false);
    return converter;
  }
  /** 创建子运行环境 */
  abstract createSubRuntime: () => RhAbstractRuntime<RhSafeAny>;
  /** 处理事件 */
  async handleEvent(
    handlers: RhEventHandler[],
    $: RhLocalSpace<RhEvent, RhSafeAny>,
    throwError = false
  ) {
    let tmpResult: RhSafeAny;
    //debugger
    if (this.disabled) return $;
    if (!handlers || !Array.isArray(handlers)) return $;
    try {
      for (const item of handlers) {
        if (item.disabled) continue;
        const detail = item.detail; //this._parseValue(item.detail, $);
        if (item.noWait) {
          try {
            this.do(item.do, detail, $, item);
            if (item.id)
              this.__emit(EXTENSION_EVENT_CHANNEL, item.id as RhSafeAny, $);
          } catch (error) {
            if (error !== null) {
              const msg = `【脱离主线】的操作执行失败！错误详情：${error}`;
              this.MsgHelper.ShowErrorMessage(error); //此处不用msg，以免破坏用户自定义的错误信息。
              console.error(msg, error);
            }
          }
        } else {
          tmpResult = this.opHandlers[item.do].showAwait
            ? await this.do(item.do, detail, $, item)
            : this.do(item.do, detail, $, item);
          if (
            tmpResult !== undefined ||
            this.opHandlers[item.do].allowReturnUndefined
          )
            $.target = tmpResult;
          if (item.id)
            this.__emit(EXTENSION_EVENT_CHANNEL, item.id as RhSafeAny, $);
        }
      }
    } catch (error) {
      if (throwError) {
        throw error;
      }
      if (error !== null) {
        console.log(error);
        this.MsgHelper.ShowErrorMessage(error);
      }
    }
    return $;
  }
  /** 执行操作 */
  private do(
    op: RhOperationKey,
    cfg: RhSafeAny,
    $: RhSafeAny,
    item: RhEventHandler
  ) {
    const handler = this.opHandlers[op];
    if (!handler) throw `不存在的操作类型【${op}】,无法执行！`;
    if (this.enabledDebugger && item.detail.debugger) {
      console.log(
        '【您已进入断点！】',
        '当前即将执行的操作项:',
        item,
        '当前target:',
        $.target,
        '当前数据集dataset:',
        $.d,
        '当前局部空间$:',
        $,
        '初始ev:',
        $.ev
      );
      this.setDebugger($);
    }
    return handler.do(cfg, this.convert(item.converters, $));
  }

  private convert(config: RhConvertHandlersGroup | undefined, $: LocalSpace) {
    if (!config || !config.enabled || config.handlers?.length == 0) return $;
    const $_ = $.R.createLocalSpace($.target, $.ev, $.host, $.schema);
    const R = $_.R;
    let tmpResult: RhSafeAny;
    config.handlers.forEach((item) => {
      if (item.disabled) return;
      const handler = R.converterHandlers[item.do];
      if (!handler) throw `不存在的转换器类型【${item.do}】,无法执行！`;
      handler.do(item.detail, $_);
      if (tmpResult !== undefined || handler.allowReturnUndefined)
        $.target = tmpResult;
    });
    return $_;
  }

  private initDataset(fields: RhModelField[], $: LocalSpace) {
    const result: Record<string, RhSafeAny> = {};
    try {
      const basicTypes = new Set(['number', 'string', 'any', 'boolean']);
      fields.forEach((item) => {
        if (item.enabled) {
          if (item.defaultValue !== undefined)
            return (result[item.key] = item.defaultValue);
          if (item.isArray) return (result[item.key] = []);
          if (basicTypes.has(item.type)) return (result[item.key] = null);
          try {
            result[item.key] = this.create(item.type, $);
          } catch (error) {
            result[item.key] = null;
          }
        }
      });
    } catch (error) {
      this.MsgHelper.ShowErrorMessage('数据集初始化异常！错误详情：' + error);
      console.error(error);
    }
    return result;
  }

  create(modelKey: string, $: LocalSpace): RhSafeAny {
    try {
      const now = () => new Date();
      const calc = (content: string) =>
        $.R._executeFormattedScriptFromStr(content, $);
      const create = (modelKey: string) => {
        const model = this.schema?.['x-component-props']?.['models'][modelKey]; //$.R.getResourceFileDetail<RhModel>("models." + config.modelKey);
        if (!model) {
          // eslint-disable-next-line no-console
          console.warn(`目标模型【${modelKey}】未注册，无法创建实例！`);
          return null;
        }
        return Function(
          '$',
          'create',
          'calc',
          'now',
          `"use strict";const target=$.target;const R=$.R;const d=$.d;return ${model.detail.content}`
        )($, create, calc, now);
      };
      return create(modelKey);
    } catch (error) {
      throw new Error(`runtime.create时发生错误:${error}`);
    }
  }
  /** 获取目标实例的权限管控信息 */
  getInstanceAuthorityOf(instanceKey: string) {
    return this.controlledItems[instanceKey];
  }
  /** 获取实例权限管控信息 */
  getInstanceAuthorities(): RhInstanceAuthorityRegistration[] {
    return Object.entries(this.controlledItems).map((item) => {
      return {
        instanceKey: item[0],
        authority: item[1],
      };
    });
  }
  /** 批量添加实例权限管控信息
   * @deprecated 权限已改为使用`RhGeneralAuthorityDirective`实现
   */
  addInstanceAuthorities(
    items: RhInstanceAuthorityRegistration[],
    clearOld?: boolean
  ) {
    if (clearOld) this.controlledItems = {};
    items.forEach((item) => {
      if (item.instanceKey)
        this.controlledItems[item.instanceKey] = item.authority;
    });
  }
  /** 批量添加自定义模板数据 */
  addCustomTemplateRefs(templates: RhPageTemplates = {}, clearOld?: boolean) {
    if (clearOld) this.customTemplateRefs.clear();
    Object.entries(templates).forEach((item) => {
      if (item[1] instanceof TemplateRef) {
        this.customTemplateRefs.set(item[0], item[1]);
      }
    });
  }
  /** 获取自定义模板 */
  getCustomTemplateRefOf(templateKey: string) {
    return this.customTemplateRefs.get(templateKey);
  }
  /** 获取所有自定义模板注册数据 */
  getCustomTemplateRefs(): RhPageTemplates {
    const result = {} as RhSafeAny;
    this.customTemplateRefs.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  /** 传入任意类型的值，遍历解析"``"格式的值 */
  _parseValue(
    value: RhSafeAny,
    dataset: LocalSpace,
    requireRetrun = false,
    useDuplicate = false
  ) {
    if (useDuplicate) value = JSON.parse(JSON.stringify(value));
    try {
      if (typeof value == 'string') {
        if (/^`[.\s\S]*`$/gm.test(value)) {
          return Function(
            '$',
            `"use strict";const target=$.target;const R=$.R;const d=$.d;${
              requireRetrun ? '' : 'return'
            } ${value.substring(1, value.length - 1)}`
          )(dataset);
        } else {
          return value.replace(/`[^`]*`/g, (v) => {
            return Function(
              '$',
              `"use strict";const target=$.target;const R=$.R;const d=$.d;${
                requireRetrun ? '' : 'return'
              } ${v.substring(1, v.length - 1)}`
            )(dataset);
          });
        }
      } else if (typeof value == 'object') {
        if (value == null) return value;
        if (Array.isArray(value)) {
          value.forEach((v, i) => {
            value[i] = this._parseValue(v, dataset, requireRetrun);
          });
        } else {
          for (const key in value) {
            value[key] = this._parseValue(value[key], dataset, requireRetrun);
          }
        }
      }
      return value;
    } catch (error) {
      console.error(error);
      return value;
    }
  }
  /** 解析runtime规定格式的标准方法 */
  _parseFormattedScript(
    content: string,
    insertDebugger?: boolean
  ): RhFormattedScript {
    return Function(
      '$',
      `"use strict";const target=$.target;const R=$.R;const d=$.d;${
        insertDebugger ? 'debugger;' : ''
      }${content /* .trim() */}`
    ) as RhSafeAny;
  }
  /** 解析并立即执行runtime规定格式的标准方法 */
  _executeFormattedScriptFromStr(
    content: string,
    $: LocalSpace,
    insertDebugger?: boolean
  ) {
    return Function(
      '$',
      `"use strict";const target=$.target;const R=$.R;const d=$.d;${
        insertDebugger ? 'debugger;' : ''
      }${content /* .trim() */}`
    )($);
  }
  /** 订阅数据集上的指定字段的数据 */
  _registerUseOfTargetData(dataPath: string) {
    if (this.proxyPools.has(dataPath)) return this.proxyPools.get(dataPath);
    const subject = new Subject();
    this.proxyPools.set(dataPath, subject);
    return subject;
  }
  /** 移除分片助手的订阅 */
  abstract _removeDisplayHelperSubscriptions: () => void;
  /** 值拷贝方法 */
  __copy(target: RhSafeAny, source: RhSafeAny[], copyAllProperties?: boolean) {
    source.forEach((obj) =>
      this.ObjectHelper.MapT(obj, target, true, copyAllProperties)
    );
  }
  /** detectChanges方法 */
  __detectChanges() {
    return this.host.cdr.detectChanges();
  }
  /** 加法运算 */
  __add(number1: number, number2: number) {
    return this.NumberHelper.add(number1, number2);
  }
  /** 减法运算 */
  __subtract(number1: number, number2: number) {
    return this.NumberHelper.subtract(number1, number2);
  }
  /** 乘法运算 */
  __multiply(number1: number, number2: number) {
    return this.NumberHelper.multiply(number1, number2);
  }
  /** 除法运算 */
  __divide(number1: number, number2: number) {
    return this.NumberHelper.divide(number1, number2);
  }
  /** 数值求和 */
  __sum(numberArr: number[], usePreciseCalculation = true) {
    if (!usePreciseCalculation) return this.lodash.sum(numberArr);
    return numberArr.reduce((total, cur) => this.__add(total, cur), 0);
  }
  /** 求和 */
  __sumBy(
    objArr: RhSafeAny[],
    iteratee: string | ((value: RhSafeAny) => number),
    usePreciseCalculation = true
  ) {
    if (!usePreciseCalculation) return this.lodash.sumBy(objArr, iteratee);
    const fn =
      typeof iteratee == 'string'
        ? (obj: RhSafeAny) => {
            return obj[iteratee];
          }
        : iteratee;
    return objArr.reduce((total, cur) => this.__add(total, fn(cur)), 0);
  }
  /** 订阅数据 */
  __subscribe(
    channel: string,
    topic: string,
    handler: (data: RhSafeAny) => RhSafeAny
  ) {
    //console.log(channel,topic);
    if (!this.dataSubscribePool.has(channel))
      this.dataSubscribePool.set(channel, new Map());
    const topics = this.dataSubscribePool.get(channel) as RhSafeAny;
    if (!topics.has(topic)) topics.set(topic, new Subject());
    const topic$ = topics.get(topic);
    return topic$.subscribe(handler);
  }
  /** 发布数据 */
  __emit(channel: string, topic: string, data: RhSafeAny) {
    const topics = this.dataSubscribePool.get(channel);
    if (!topics) return false;
    const topic$ = topics.get(topic);
    if (!topic$) return false;
    topic$.next(data);
    return true;
  }
}
