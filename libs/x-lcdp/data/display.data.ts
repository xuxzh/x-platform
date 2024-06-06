import { Observable, Subscription } from 'rxjs';
import {
  LocalSpace,
  RhEventListener,
  RhOpHandler,
  RhOperation,
} from '../model';
import { guid } from '@x/base/core';
import { RhSafeAny } from '@x/base/model';

export class RhOpDisplayDataHandler implements RhOpHandler<RhOpDisplayData> {
  readonly willChangeTarget: boolean = false;
  readonly targetDescription?: string | undefined = 'target不会发生变化';
  readonly showAwait: boolean = false;
  /** 订阅记录 */
  private subscriptions: Map<RhSafeAny, Subscription> = new Map();

  do(config: RhOpDisplayData, $: LocalSpace): RhSafeAny {
    const R = $.R;
    const old = this.subscriptions.get(config.poolKey);
    if (old) old.unsubscribe();
    this.subscriptions.set(
      config.poolKey,
      R.displayHelper
        .registerFragmentWithDataSource(
          {
            poolKey: config.poolKey,
            fragmentSize: config.fragmentSize,
            dataset: [], //R._executeFormattedScriptFromStr(config.initialData, $),
            interval: config.enableCarousel
              ? Math.max(config.carouselInterval || 0, 0.5) * 1000
              : null,
            fill: config.enableDataFilling
              ? R._parseFormattedScript(config.dataFillingMethod)
              : null,
            useNewFragmentDataWhenSubscribe:
              config.resetFragmentWhenNewDataQueried,
          },
          {
            data$: new Observable((subscriber) => {
              R.handleEvent(config.dataSourceCreator.handlers, $, false).then(
                ($: RhSafeAny) => {
                  subscriber.next(Array.isArray($.target) ? $.target : []);
                  subscriber.complete();
                }
              );
            }),
            interval: Math.max(config.poolInterval || 0, 0.5) * 1000,
          }
        )
        .subscribe((data: RhSafeAny) => {
          R.handleEvent(
            config.dataHandler.handlers,
            R.createLocalSpace(data),
            false
          );
        })
    );
  }

  clearSubscriptions() {
    this.subscriptions.forEach((item) => item.unsubscribe());
    this.subscriptions.clear();
  }
}

export class RhOpDisplayData extends RhOperation {
  constructor(
    /** 唯一id */
    public poolKey: string = guid(),
    /** 数据源 */
    public dataSourceCreator: RhEventListener = new RhEventListener(),
    /** 启用轮询 */
    public enablePool = true,
    /** 轮询间隔 */
    public poolInterval = 60,
    /** 启用数据分片 */
    public enableSlice = true,
    /** 分片大小 */
    public fragmentSize = 10,
    /** 启用数据轮播 */
    public enableCarousel = true,
    /** 轮播间隔 */
    public carouselInterval = 10,
    /** 数据处理 */
    public dataHandler: RhEventListener = new RhEventListener(),
    /** 初始数据 */
    //public initialData: string = 'return []',
    /** 启用数据填充 */
    public enableDataFilling = false,
    /** 数据填充方法 */
    public dataFillingMethod = 'return {}',
    /** 当定时轮询（或被推送到）到新数据后，是否重置分片，从头开始播放 */
    public resetFragmentWhenNewDataQueried = false
  ) {
    super();
  }
}
