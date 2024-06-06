import { RhSafeAny } from '@x/base/model';
import { Observable, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';

/** 分片配置 */
interface FragmentRegisterConfig<T> {
  /** key值 */
  poolKey: string;
  /** 分片大小。置null表示不启用分片，直接使用所有数据，且不进行填充 */
  fragmentSize: number;
  /** 初始数据。 */
  dataset: T[];
  /** 分片切换间隔。置null表示不使用分片轮播功能 */
  interval: number;
  /** 填充方法。置null表示不对数据量不足的分片进行数据填充 */
  fill: (index?: number) => T;
  /** 订阅时，是否重置分片注册数据 */
  useNewFragmentDataWhenSubscribe?: boolean;
}

/** 数据源订阅配置 */
interface DataSubscribeConfig<T> {
  /** 数据源接口 */
  data$: Observable<T>;
  /** 调用间隔 */
  interval: number;
}

/** 高级配置 */
interface AdvancedConfig {
  /** 不推送初始数据 */
  noInitialData: boolean;
  /** 取消订阅后，清除当前分片注册的数据 */
  clearFragmentDataWhenUnsubscribe: boolean;
}

const createDefaultAdvancedConfig = () => {
  return {
    noInitialData: true,
    clearFragmentDataWhenUnsubscribe: false,
    useLastFragmentDataWhenSubscribe: true,
  } as AdvancedConfig;
};
class RhvDisplayFragment<T> {
  constructor(
    public StartIndex: number,
    public EndIndex: number,
    public FragmentSize: number,
    /** 标记当前是第几片。从1开始标号。 */
    public CurFragmentNo: number,
    public Fill: (index?: number) => T
  ) {}
}

/** 展示助手 */
/* @Injectable({
    providedIn: "root"
}) */
export class RhvDisplayHelper {
  /** 分片数据配置池 */
  private fragmentsPool: Map<string, RhvDisplayFragment<any>> = new Map();

  /**
   * 注册分片数据，并托管数据接入，返回一个持续不断的数据流。
   */
  public registerFragmentWithDataSource<T>(
    config: FragmentRegisterConfig<T>,
    dataSubscribeConfig: DataSubscribeConfig<T[]>,
    advancedConfig: AdvancedConfig = createDefaultAdvancedConfig()
  ) {
    config.dataset = config.dataset || [];
    const tmp: {
      dataSubscription: Subscription | null;
      fragmentSubscription: Subscription | null;
    } = {
      dataSubscription: null,
      fragmentSubscription: null,
    };
    const $ = new Observable<T[]>((subscriber) => {
      /** 推送初始数据 */
      if (!advancedConfig.noInitialData) {
        subscriber.next(
          //不启用分片时，直接返回所有数据源。
          config.fragmentSize === null
            ? config.dataset
            : //启用分片时，
              //如果提供了填充方法，先进行填充，然后推送第一片的数据
              //如果没有提供填充方法，直接推送初始数据的第一片数据
              (config.fill
                ? this.fillData(
                    config.dataset,
                    config.fragmentSize,
                    config.fill
                  )
                : config.dataset
              ).slice(0, config.fragmentSize)
        );
      }
      /** 订阅数据源 */
      tmp.dataSubscription = this.subscribeData(dataSubscribeConfig).subscribe(
        (data) => {
          //不需要分片的情况下，直接推送所有数据
          if (config.fragmentSize === null) {
            subscriber.next(data || []);
            return;
          }
          //捕获数据源接口调用失败的情况，此时不做任何操作。
          if (data === null) {
            return;
          }
          // 取消上次的分片订阅
          tmp.fragmentSubscription && tmp.fragmentSubscription.unsubscribe();
          // 重新订阅分片
          tmp.fragmentSubscription = this.registerFragment({
            ...config,
            dataset: data,
          }).subscribe((result) => {
            //推送分片数据
            subscriber.next(result);
          });
          return;
        }
      );
    });
    //劫取原生的订阅方法。
    const _subscribe = $.subscribe;
    $.subscribe = function (next?: any, error?: any, complete?: any) {
      //正常订阅，并取得subscription
      const _subscription: Subscription = _subscribe.call(
        $,
        next,
        error,
        complete
      );
      //劫取取消订阅方法
      const _unsubscribe = _subscription.unsubscribe;
      //覆写
      _subscription.unsubscribe = function () {
        tmp.dataSubscription && tmp.dataSubscription.unsubscribe();
        tmp.fragmentSubscription && tmp.fragmentSubscription.unsubscribe();
        if (advancedConfig.clearFragmentDataWhenUnsubscribe)
          (this as RhSafeAny).fragmentsPool.delete(config.poolKey);
        _unsubscribe.call(_subscription);
      };

      return _subscription;
    };
    return $;
  }

  /** 订阅数据源 */
  public subscribeData<T>(config: DataSubscribeConfig<T>) {
    /** 如果数据源获取间隔设置为null，则直接返回数据源。 */
    if (config.interval === null) {
      return config.data$;
    }
    /** 轮询模式 */
    const tmp: {
      timerSubscription: Subscription | null;
    } = {
      timerSubscription: null,
    };
    const $ = new Observable<T>((subscriber) => {
      tmp.timerSubscription = timer(0, config.interval).subscribe(() => {
        config.data$.subscribe(
          (data) => {
            subscriber.next(data);
          },
          (err) => {
            //出错时推送null
            subscriber.next(null as RhSafeAny);
          }
        );
      });
    });
    //劫取原生的订阅方法。
    const _subscribe = $.subscribe;
    $.subscribe = function (next?: any, error?: any, complete?: any) {
      //正常订阅，并取得subscription
      const _subscription: Subscription = _subscribe.call(
        $,
        next,
        error,
        complete
      );
      //劫取取消订阅方法
      const _unsubscribe = _subscription.unsubscribe;
      //覆写
      _subscription.unsubscribe = function () {
        tmp.timerSubscription?.unsubscribe();
        _unsubscribe.call(_subscription);
      };

      return _subscription;
    };
    return $;
  }

  /**
   * 注册分片数据配置
   * @param config
   */
  public registerFragment<T>(config: FragmentRegisterConfig<T>) {
    const history = this.getCurFragmentConfig(config.poolKey);
    // 如果需要新建或者历史数据不存在，就重新注册。
    if (config.useNewFragmentDataWhenSubscribe || !history) {
      this.fragmentsPool.set(
        config.poolKey,
        new RhvDisplayFragment(
          -1 * config.fragmentSize,
          0,
          config.fragmentSize,
          0,
          config.fill
        )
      );
    }
    // 如果不需要轮播，单推一次分片数据
    if (config.interval === null)
      return new Observable<T[]>((subscriber) => {
        const data = config.fill
          ? this.fillData(config.dataset, config.fragmentSize, config.fill)
          : config.dataset;
        subscriber.next(
          config.fragmentSize === null
            ? data
            : data.slice(0, config.fragmentSize)
        );
        subscriber.complete();
      });
    /* 否则定时分片推送 */
    return timer(0, config.interval).pipe(
      map(() => {
        const fragment = this.fragmentsPool.get(config.poolKey);
        if (!fragment) return config.dataset;
        return this.nextFragment(config.dataset, fragment);
      })
    );
  }

  /**
   * 分片的下一组数据
   * 如果找不到配置，就直接返回原数据。
   * 如果传入数据为空，或数组大小为0，则直接返回空数组。
   * 新的分片如果长度不足设定的大小，则根据填充方法进行填充。
   * 最后，返回分片数据。
   */
  public nextFragment<T>(data: T[], config: RhvDisplayFragment<T>) {
    if (!data || !Array.isArray(data)) return [];
    config.StartIndex += config.FragmentSize;
    if (config.StartIndex >= data.length) {
      config.StartIndex = 0;
    }
    config.EndIndex = config.StartIndex + config.FragmentSize;
    config.CurFragmentNo += 1;
    const curResult = data.slice(config.StartIndex, config.EndIndex);
    for (let i = curResult.length; i < config.FragmentSize; i++) {
      if (config.Fill) {
        curResult.push(config.Fill(i));
      }
    }
    return curResult;
  }

  /** 获取指定poolkey对应的当前分片配置数据 */
  public getCurFragmentConfig(poolKey: string) {
    return this.fragmentsPool.get(poolKey);
  }

  /**
   * 结合分片大小和填充方法，填充指定数据源数组。
   * @param data 已有数据源
   * @param blockSize 分片大小
   * @param fill 填充空白数据的方法
   */
  public fillData<Data>(
    data: Data[],
    blockSize: number,
    fill: (index?: number) => Data
  ) {
    let det = 0;
    if (data.length > 0) {
      det = blockSize - (data.length % blockSize);
      if (det == blockSize) return data;
    } else {
      det = blockSize;
    }
    const startIndex = data.length;
    for (let i = startIndex; i < startIndex + det; i++) {
      data.push(fill(i));
    }
    return data;
  }

  /** 按给定键值分组 */
  public groupBy<T>(arr: T[], key: string) {
    const map = new Map<string, T[]>();
    const result: T[][] = [];
    arr.forEach((item: RhSafeAny) => {
      const tmp = map.get(item[key]);
      if (tmp) tmp.push(item);
      else map.set(item[key], [item]);
    });
    map.forEach((item) => {
      result.push(item);
    });
    return result;
  }

  /** 获取分片信息 */
  public getFragmentInfo(poolKey: string) {
    return this.fragmentsPool.get(poolKey);
  }

  /** 获取指定池子的当前分片序号。找不到时返回-1 */
  public getCurFragmentNo(poolKey: string) {
    try {
      return (this.getFragmentInfo(poolKey) as RhSafeAny).CurFragmentNo;
    } catch (error) {
      return -1;
    }
  }

  /** 是否是轮播数据新的一圈的开始。 */
  public isBeginOfNewRound(poolKey: string) {
    const curFragmentInfo: RhvDisplayFragment<any> = this.getFragmentInfo(
      poolKey
    ) as RhSafeAny;
    return (
      curFragmentInfo &&
      curFragmentInfo.StartIndex == 0 &&
      curFragmentInfo.CurFragmentNo != 1
    );
  }
}
