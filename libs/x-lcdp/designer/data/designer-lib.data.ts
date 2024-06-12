export const xDesignerLibDeclaration = `
    declare type RhSafeAny = any;
    declare type WithNil<T> = T | null | undefined;

    declare const $:LocalSpace;
    declare const R:RhRuntime;
    declare const d:RhDataset;
    declare const target:RhTarget;

    type RhComponentSchema = RhComponentSchemaDto;
    /** 用于存储的组件JSON schema模型 */
    interface RhComponentSchemaDto extends RhSelectableDto, Partial<RhUpdateTime> {
        /** 页面key，根节点才有 */
        pageKey?: string;
        /** 版本号，根节点才有 */
        version?: string;
        /** 唯一标识，一般自动生成guid */
        key: string;
        /** 组件类型，\`basic-div\`|\`basic-button\`等 */
        compType: string;
        name: string;
        /** 组件中文名称 */
        displayName: string;
        /** 组件中文描述 */
        description?: string;
        /** 组件类型 */
        type: RhComponentResourceType;
        /** 是否嵌套有子容器 */
        hasChildContainer?: boolean;
        /** 父节点Key */
        parent: string | null;
        /** 组件类对应的标识 */
        'x-component'?: string;
        /** 组件数据 */
        'x-component-data'?: WithNil<RhDataLinkConfig>;
        /** 组件属性 */
        'x-component-props'?: WithNil<Record<string, RhSafeAny>>;
        /** 组件事件 */
        'x-component-events'?: WithNil<RhEventsListenersDataset>;
        /** 包装器样式
         * @description 组件池中的非容器组件\`type !=='container'\`，一般都会包装一层div，针对这层div可以设置样式
         */
        'x-wrapper-styles'?: WithNil<Record<string, RhSafeAny>>;
        /** 组件样式 */
        'x-component-styles'?: WithNil<Record<string, RhSafeAny>>;
        /** 组件类 */
        'x-component-class'?: WithNil<RhComponentDynamicStyleDto>;
        /** json schema对应的一维数据 */
        'x-component-map'?: Record<string, RhSafeAny>;
        'x-component-addons'?: RhComponentEquippedAddonsDataset;
        /** 子节点配置 */
        children: RhComponentSchemaDto[];
        /** 组件配置，用来存什么？ */
        config?: Record<string, RhSafeAny>;
        /** 层级，默认最外层为0 */
        level: number;
        /** 定位，在\`children\`数组中的\`index\`，从零开始 */
        loc: number[];
    }
    /** 选择项模型 */
    declare class RhSelectableDto {
        check?: boolean | undefined;
        select?: boolean | undefined;
        expand?: boolean;
        disabled?: boolean;
        [prop: string]: RhSafeAny;
    }

    /** 局部空间 */
    declare class RhLocalSpace<T, D> {
        /** 要操作的目标 */
        target: T;
        /** 宿主组件 */
        host: WithNil<RhAbstractComponent<RhSafeAny>>;
        /** 运行环境runtime */
        R: RhAbstractRuntime<D>;
        /** 局部空间的创造者 */
        schema: WithNil<RhComponentSchema>;
        /** 事件对象 */
        ev: WithNil<RhEvent>;
        get d(): WithNil<D>;
        get c(): WithNil<RhPage>;
        get hostData(): WithNil<RhSafeAny>;
        get extraData(): WithNil<RhSafeAny>;
        /** 附加信息 */
        message?: RhSafeAny;
        constructor(
        /** 要操作的目标 */
        target: T,
        /** 宿主组件 */
        host: WithNil<RhAbstractComponent<RhSafeAny>>,
        /** 运行环境runtime */
        R: RhAbstractRuntime<D>,
        /** 局部空间的创造者 */
        schema: WithNil<RhComponentSchema>,
        /** 事件对象 */
        ev: WithNil<RhEvent>);
    }
    /** 局部空间简写 */
    type LocalSpace = RhLocalSpace<RhTarget, RhDataset>;
    /** 脚本空间中的脚本格式定义 */
    type RhFormattedScript = ($: LocalSpace) => RhSafeAny;
    /** 运行环境 */
    declare abstract class RhAbstractRuntime<D> {
        /** 代理池。用于管理动态内容使用的对应数据，当数据发生变更时，通知对应组件 */
        private proxyPools;
        /** 数据集代理对象 */
        private datasetProxy;
        /** 数据订阅总线 */
        private dataSubscribePool;
        /** 关联的宿主 */
        private host;
        /** 关联的页面配置 */
        private page;
        /** 实例集合 */
        private instances;
        /** 数据集 */
        private _dataset;
        /** 父级运行环境 */
        protected parent?: RhAbstractRuntime<RhSafeAny>;
        /** 是否停工状态 */
        disabled: boolean;
        get schema(): WithNil<RhPage>;
        get dataset(): WithNil<D>;
        abstract lodash: typeof lodash;
        abstract rxjs: typeof rxjs;
        abstract operators: typeof operators;
        abstract datefns: typeof datefns;
        abstract screenfull: typeof screenfull;
        abstract go: typeof go;
        abstract echarts:RhSafeAny;
        abstract MsgHelper: RhSafeAny;
        abstract ObjectHelper: RhSafeAny;
        abstract NumberHelper: RhSafeAny;
        abstract ArrayHelper: RhSafeAny;
        abstract FunctionHelper: RhSafeAny;
        abstract FileHelper: RhSafeAny;
        abstract FlowchartHelper: RhSafeAny;
        abstract DateHelper: RhSafeAny;
        abstract TreeHelper: RhSafeAny;
        abstract I18nHelper: RhSafeAny;
        abstract apiService: RhSafeAny;
        abstract storageService: RhSafeAny;
        abstract customContents: RhCustomContents;
        abstract opHandlers: RhOpHandlersDataset;
        abstract operations: RhOperationsDataset;
        abstract http: HttpClient;
        abstract router: Router;
        constructor();
        /** 将当前runtime与目标页面建立连接 */
        link(host: RhSafeAny, page: RhPage): void;
        /** 添加实例 */
        addInstance(key: string, instance: RhAbstractComponent<RhSafeAny>): void;
        /** 移除实例 */
        removeInstance(key: string): void;
        /** 查找实例 */
        findInstance(key: string): RhAbstractComponent<any> | undefined;
        /** 从页面json树中查找目标节点 */
        findComponentSchema(key: string, root?: RhComponentSchema): RhComponentSchema | null;
        /** 初始化数据代理 */
        private initDatasetProxy;
        /** 创建局部空间 */
        createLocalSpace(target: RhSafeAny, ev?: WithNil<RhEvent>, host?: WithNil<RhAbstractComponent<RhSafeAny>>, schema?: WithNil<RhComponentSchema>): RhLocalSpace<RhSafeAny, RhSafeAny>;
        /** 创建操作 */
        createOperation(op: RhOperationKey, params: Partial<RhOperation>): RhOperation;
        /** 创建子运行环境 */
        abstract createSubRuntime: () => RhAbstractRuntime<RhSafeAny>;
        /** 处理事件 */
        handleEvent(handlers: RhEventHandler[], $: RhLocalSpace<RhEvent, RhSafeAny>, throwError?: boolean): Promise<RhLocalSpace<RhEvent, any>>;
        /** 执行操作 */
        private do;
        private initDataset;
        create(modelKey: string, $: LocalSpace): RhSafeAny;
        /** 传入任意类型的值，遍历解析"\`\`"格式的值 */
        _parseValue(value: RhSafeAny, dataset: LocalSpace, requireRetrun?: boolean, useDuplicate?: boolean): any;
        /** 解析runtime规定格式的标准方法 */
        _parseFormattedScript(content: string): RhFormattedScript;
        /** 解析并立即执行runtime规定格式的标准方法 */
        _executeFormattedScriptFromStr(content: string, $: LocalSpace): any;
        /** 订阅数据集上的指定字段的数据 */
        _registerUseOfTargetData(dataPath: string): Subject<unknown> | undefined;
        /** 值拷贝方法 */
        __copy(target: RhSafeAny, source: RhSafeAny[], copyAllProperties?: boolean): void;
        /** detectChanges方法 */
        __detectChanges(): any;
        /** 加法运算 */
        __add(number1: number, number2: number): any;
        /** 减法运算 */
        __subtract(number1: number, number2: number): any;
        /** 乘法运算 */
        __multiply(number1: number, number2: number): any;
        /** 除法运算 */
        __divide(number1: number, number2: number): any;
        /** 数值求和 */
        __sum(numberArr: number[], usePreciseCalculation?: boolean): number;
        /** 求和 */
        __sumBy(objArr: RhSafeAny[], iteratee: string | ((value: RhSafeAny) => number), usePreciseCalculation?: boolean): any;
        /** 订阅数据 */
        __subscribe(channel: string, topic: string, handler: (data: RhSafeAny) => RhSafeAny): any;
        /** 发布数据 */
        __emit(channel: string, topic: string, data: RhSafeAny): boolean;
    }

    /** 运行环境简写 */
    type RhRuntime = RhRuntimeService<RhSafeAny>;
    declare class RhRuntimeService<D> extends RhAbstractRuntime<D> {
        http: HttpClient;
        router: Router;
        apiService: RhApiConfigService;
        storageService: RhStorageService;
        appConfigService: RhAppConfigService;
        labelService: RhLabelService;
        opHandlers: RhOpHandlersDataset;
        operations: RhOperationsDataset;
        get MsgHelper(): typeof MsgHelper;
        get ObjectHelper(): typeof ObjectHelper;
        get NumberHelper(): typeof RhNumberHelper;
        get ArrayHelper(): typeof ArrayHelper;
        get FunctionHelper(): typeof FunctionHelper;
        get FlowchartHelper(): typeof FlowchartHelper;
        get DateHelper(): typeof DateHelper;
        get FileHelper(): typeof FileHelper;
        get TreeHelper(): typeof RhTreeHelper;
        get I18nHelper(): typeof I18nHelper;
        get rxjs(): typeof rxjs;
        get operators(): typeof operators;
        get lodash(): any;
        get datefns(): typeof datefns;
        get screenfull(): typeof screenfull;
        get go(): typeof go;
        constructor(http: HttpClient, router: Router, apiService: RhApiConfigService, storageService: RhStorageService, appConfigService: RhAppConfigService, labelService: RhLabelService,opHandlers: RhOpHandlersDataset, operations: RhOperationsDataset);
        createSubRuntime: () => RhAbstractRuntime<RhSafeAny>;
        static ɵfac: i0.ɵɵFactoryDeclaration<RhRuntimeService<any>, never>;
        static ɵprov: i0.ɵɵInjectableDeclaration<RhRuntimeService<any>>;
    }


    /**
     * 消息助手
     * @description 消息api的二次封装，解除组件与\`NzModalService\`和\`NzMessageService\`的耦合
     */
    declare class MsgHelper {
        /**
         * 显示成功消息的模态窗口
         * @param msg 消息
         */
        static ShowSuccessModal(msg: string): void;
        /**
         * 显示错误消息的模态窗口
         * @param msg 消息
         */
        static ShowErrorModal(msg: string): void;
        /**
         * 显示常规消息的模态窗口
         * @param msg 消息
         */
        static ShowInfoModal(msg: string): void;
        /**
         * 显示警告消息的模态窗口
         * @param msg 消息
         */
        static ShowWarningModal(msg: string): void;
        /**
         * 显示确认模态窗口
         * @param title 标题
         * @param content 内容
         * @param okFun 点击确定后的回调函数
         */
        static ShowConfirmModal(title: string, content: string, okFun: () => void | Promise<void | boolean>, cancelFn?: () => void, okType?: 'primary' | 'danger', okText?: string, cancelText?: string): void;
        /**
         * 显示成功的提示信息
         * @param msg 消息
         */
        static ShowSuccessMessage(msg: string): void;
        /**
         * 显示提示信息
         * @param msg 消息
         */
        static ShowInfoMessage(msg: string): void;
        /**
         * 显示提示信息
         * @param msg 消息
         */
        static ShowTodoMessage(): void;
        /**
         * 显示警告的提示信息
         * @param msg 消息
         */
        static ShowWarningMessage(msg: string): void;
        /**
         * 显示错误的提示信息
         * @param msg 消息
         */
        static ShowErrorMessage(msg: string): void;
        /** 显示全局loading对话框，仅有一个
         * @param msg 展示信息
         * @param duration 持续时间(毫秒),当设置为0时不消失，默认为\`3000\`毫秒
         */
        static ShowGlobalLoadingMessage(msg: string, duration?: number): void;
        static CloseGlobalLoadingMessage(): void;
    }

type HttpMethod = 'GET' | 'POST';
/** 定位接口模型 */
declare class RhInterfaceLocationDto implements IRHInterfaceLocation {
    controllerName: WithNil<string>;
    interfaceName: WithNil<string>;
    interfaceType: HttpMethod;
    /** 接口请求地址url,形如\`http://xxxxxx\` */
    url?: WithNil<string>;
    ServerIp?: string;
    GlobalPrefix?: string;
    ModuleName?: string;
    port?: WithNil<number>;
    /** 接口输入参数 */
    inputPara?: RhSafeAny;
    /** 接口描述 */
    description?: WithNil<string>;
    constructor(controllerName: WithNil<string>, interfaceName: WithNil<string>, interfaceType: HttpMethod);
    static create(): RhInterfaceLocationDto;
}
/** 接口配置模型 */
interface IRHInterfaceLocation {
    interfaceType: HttpMethod;
    port?: WithNil<number>;
    controllerName: WithNil<string>;
    interfaceName: WithNil<string>;
    /** 接口描述 */
    description?: WithNil<string>;
}

declare class RhApiConfigService {
  http: HttpClient;
  appConfigSer: RhAppConfigService;
  get config(): RhAppConfigDto;
  isLoggerOn: boolean;
  private _lcdpModuleConfigDataSet;
  constructor(http: HttpClient, appConfigSer: RhAppConfigService);
  GetPp<OutT>(ctrlName: string, actionName: string, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  PostPp<InputT, OutT>(ctrlName: string, actionName: string, dto?: InputT, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  GetRdp<OutT>(ctrlName: string, actionName: string, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  PostRdp<InputT, OutT>(ctrlName: string, actionName: string, dto?: InputT, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  GetMdp<OutT>(ctrlName: string, actionName: string, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  PostMdp<InputT, OutT>(ctrlName: string, actionName: string, dto?: InputT, options?: RhHttpOptions, enableMock?: boolean): Observable<RhSafeAny>;
  GetMock<OutT>(ctrlName: string, actionName: string, options?: RhHttpOptions, projectCode?: string): Observable<RhSafeAny>;
  postMock<InpuT, OutT>(ctlName: string, actionName: string, dto?: InpuT, options?: RhHttpOptions, projectCode?: string): Observable<OutT>;
  private GetMockApiUrl;
  /**
   * 通用nest接口post调用
   */
  postLcdp<InputT, OutT>(ctlName: string, actionName: string, dto?: InputT, options?: RhHttpOptions): Observable<OutT>;
  /**
   * 通用nest接口get调用
   */
  getLcdp<OutT>(ctrlName: string, actionName: string, options?: RhHttpOptions): Observable<OutT>;
  private getLcdpApi;
  /**
   * 根据控制器名称和路由名称获取产品管理完整的操作接口Url地址
   * @param ctrlName 控制器名称
   * @param actionName 方法名称
   * @param localField 该端口对应的控制本地调试的字段
   */
  GetApiOperateUrl(type: RhPortType | number, ctrlName: string, actionName: string, localField: RhPortLocalFieldType): string;
  /** 根据端口类型获取前缀Url片段
   * @param type:端口类型或者端口号
   * @param config:程序配置；
   * @param localField 该端口对应的控制本地调试的字段
   */
  private getPrefixSnippet;
  /**
   * 通用的http请求处理方法(Observable)
   * @param interfaceDto 接口信息
   * @param para 输入参数
   * @param option 请求配置
   * @param enableMock 是否启用Mock
   * @returns
   */
  httpHandler(interfaceDto: RhInterfaceLocationDto, para?: RhSafeAny, option?: RhSafeAny, enableMock?: boolean): Observable<DataResultT<RhSafeAny>>;
  /**
   * 通用的http请求处理方法(Promise)
   * @param interfaceDto 接口信息
   * @param para 输入参数
   * @param option 请求配置
   * @param enableMock 是否启用Mock
   * @returns
   */
  httpHandlerPromise(interfaceDto: RhInterfaceLocationDto, para?: RhSafeAny, option?: RhSafeAny, enableMock?: boolean): Promise<DataResultT<RhSafeAny>>;
  /**
   * 通用的post接口
   * @param interfaceDto
   * @param para
   * @param option
   * @param enableMock
   * @description 仅能在内部调用
   * @returns
   */
  private postHandler;
  /**
   * 通用get方法
   * @param interfaceDto
   * @param para
   * @param option
   * @param enableMock
   * @description 仅能在内部调用
   * @returns
   */
  private getHandler;
  /**
   * 使用完整的接口网址发起请求
   * @param httpType 请求类型
   * @param url 请求接口地址
   * @param body
   * @param options
   * @returns
   */
  httpUrlHandler<T>(httpType: WithNil<HttpMethod>, url: string, body: RhSafeAny, options?: RhHttpOptions): Observable<T>;
  /**
   * 处理url中的\`\${host}\`/\`\${port}\`等占位符
   * @param url 处理前的url
   * @returns 处理后的url
   */
  urlParse(url: string): string;
  get<T>(url: string, options?: RhHttpOptions): Observable<T>;
  post<T>(url: string, body: RhSafeAny, options?: RhHttpOptions): Observable<T>;
  getUrl(interfaceDto: RhInterfaceLocationDto): string;
  getSettingEntry(moduleKey: string, groupKey: string, paraCode: string): Observable<DataResultT<RhSelectItem[]>>;
  /**
   *  获取下拉框数据选项列表
   */
  GetGeneralSelectDataItems(queryDto: GeneralDataItemQueryDto): Observable<RhSelectItem[]>;
  /**
   *  根据业务类型获取单据状态选项列表
   */
  GetOrderStatusSelectItems(businessType: string): Observable<DataResultT<RhSelectItem[]>>;
  /**
   * 根据端口类型返回端口号
   * @param type 端口类型
   */
  getPortNum(type: RhPortType): any;
  /** 判定是否本地调试模式 */
  private getLocalMode;
  private printLogInfo;
  /**
   * 根据模块名称获取模块详细信息
   * @param moduleName 模块名称
   * @returns 模块详细信息
   */
  private getModuleConfigInfo;
  static ɵfac: i0.ɵɵFactoryDeclaration<RhApiConfigService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<RhApiConfigService>;
}

/**
 * webapp 程序配置
 */
declare class RhAppConfigDto {
    /** 是否启用单点登录 */
    SSOEnable: boolean;
    /** admin是否启用单点登录，在\`SSOEnable\`为\`true\`时进行二次判断 */
    AdminSSO: boolean;
    /** 是否拦截所有接口 */
    IsInterceptAll: boolean;
    /** 是否启用用户组 */
    IsUserGroupOn: boolean;
    /** 是否使用站点的ip,启用后，会忽略\`ServerIp\`而使用当前网站的ip作为接口请求Ip */
    IsUserSiteServerIp: boolean;
    /** Node服务器地址 */
    NodeServerIp: string;
    /** Mock服务器地址
     * @deprecated 请使用\`NodeServerIp\`
     */
    MockServerIp: string;
    /** 低代码服务器地址
     * @deprecated 请使用\`NodeServerIp\`
     */
    LcdpServerIp: string;
    /** Mock服务器端口号 */
    MockApiPort: number;
    LcdpApiPort: number;
    /** 是否启用Mock功能 */
    enableMock: boolean;
    /** 是否对所有接口启用Mock */
    isMockAll: boolean;
    /** 是否本地调试MockApi */
    isMockApiLocal: boolean;
    /** mock项目代码，默认为\`DefaultProject\` */
    mockProjectCode: string;
    isLcdpLocal: boolean;
    /** 是否启用瑞辉相关服务 */
    EnableRuiHuiService: boolean;
    /** 第三方接口服务器Ip 地址 */
    ServerIp: string;
    /** 开发者模式,指示动态表单是开发者模式还是用户模式 && 非生产模式下要存储开发模式配置(app-config.json) */
    DeveloperMode: boolean;
    /** 是否在控制台输出JSON */
    IsLoggerOn: boolean;
    /** 公司名称 */
    CompanyName: string;
    /** 公司代码 */
    CompanyCode: string;
    [propName: string]: RhSafeAny;
}
declare class RhAppConfigService {
  storage: RhStorageService;
  private connectionErrorSubject;
  /** 网络连接发生错误的订阅 */
  get connectionError$(): import("rxjs").Observable<string>;
  clearUserSessionSubject: Subject<void>;
  get clearUserSession$(): import("rxjs").Observable<void>;
  set isDebug(status: boolean);
  /** 是否显示调试组件 */
  get isDebug(): boolean;
  /** 服务器配置备份，用于调试模式下还原配置 */
  private serverAppConfigBackup;
  get appConfig(): RhAppConfigDto | null;
  private _paraConfigDatas;
  get paraConfigDatas(): Record<string, RhSelectItem[]>;
  private _projectConfig;
  get projectConfig(): RhProjectConfigDto;
  constructor(storage: RhStorageService);
  /**
   * 触发网络连接错误通知
   * @param msg 通知消息
   */
  connectionErrorTrigger(msg: string): void;
  /** 备份服务器配置 */
  setAppConfigBackup(config: RhAppConfigDto): void;
  /**
   * 设置程序配置，禁止在StartupService以外的地方调用该函数
   * @param config 程序配置
   */
  setAppConfig(config: RhAppConfigDto): void;
  /**
   * 存储调试配置，禁止在\`debugSnippetComponent\`以外使用
   * @param config 调试配置存储
   */
  setDebugAppConfig(config: RhAppConfigDto): void;
  /** 重置为服务器上的配置 */
  resetToServerAppconfig(): void;
  /** 存储的用于管道和下拉框的通用数据 */
  setParaConfigDatas(datas: Record<string, RhSelectItem[]>): void;
  /**
   * 设置项目配置，禁止在StartupService以外的地方调用该函数
   * @param config 项目配置
   */
  setProjectConfig(config: RhProjectConfigDto): void;
  /**
   * 返回用户工厂代码，如果没有，则返回\`app-config.json\`中的\`CompanyCode\`
   * @returns 工厂代码
   */
  getFactoryCode(): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<RhAppConfigService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<RhAppConfigService>;
}

type MenuNodeType = 'Normal' | 'MainChild';
type RhMenuTreeVisibilityType = 'All' | 'Root';
type RhThemeType = 'default' | 'compact' | 'dark';
type RhDynamicTableButtonLayoutType = 'inline' | 'header' | 'dropdown';
/**
 * 项目配置对象模型
 */
interface RhProjectConfigDto {
    /** 项目显示形成 */
    ProjectDisplayName: string;
    /** 项目名称 */
    ProjectName: string;
    /** 启用权限控制标识 */
    AuthorityUser: string;
    /** 菜单默认显示图标 */
    DefaultIcon: string;
    /** 是否启用菜单路由卫士 */
    EnableMenuGuard: boolean;
    /** 菜单模式 */
    MenuMode: MenuNodeType;
    /** 主路由路径
     * @description web项目中:main
     */
    MainPath: string;
    /** 主页路径(如:DefaultPage)*/
    MainPagePath: string;
    /** 登录页面路由路径 */
    LoginPath: string;
    /** 设计器路由地址 */
    DesignerPath: string;
    /** 预览路由地址 */
    PreviewPath: string;
    /** 默认主题 */
    DefaultTheme: RhThemeType;
    /** 根菜单名称 */
    RootMenu: string;
    /** 是否支持锁屏 */
    IsLockScreen: boolean;
    /**设置锁屏前无操作时长 */
    TriggerLockScreenTime: number;
    /** 当前版本 */
    Version: string;
    /** 版本设置开关 */
    VersionSetting: boolean;
    [propName: string]: RhSafeAny;
}

declare class ObjectHelper {
  /**
   * 映射对象
   * @param source 源对象
   * @param dest 目标对象
   * @param isNullEnable 当源对象的值为null，是否需要覆盖目标对象，默认为\`true\`,
   * @param isForce 当目标对象没有对应属性时，是否强制赋值，默认为\`true\`
   *
   * @description 默认为true,映射目标对象不存在的属性,是否强制赋值，请将\`isForce\`赋值为\`true\`
   */
  static MapT<T1 extends Record<string, RhSafeAny>, T2 extends Record<string, RhSafeAny>>(source: T1, dest: T2, isNullEnable?: boolean, isForce?: boolean): void;
  static createNullValueObject(source: Record<string, unknown>): Record<string, null>;
  /**
   * 深度复制数组&&对象, _cloneDeep
   * @param value 复制对象
   */
  static cloneDeep(value: RhSafeAny): any;
  /** 验证给定的object是否有path指定的属性或属性数组
   * @param object 给定对象
   * @param path 给定的属性，或者属性数组
   * @example
   * \`\`\`ts
   * var object = { 'a': { 'b': { 'c': 3 } } };
   *
   * _.has(object, 'a');
   * // => true
   *
   * _.has(object, 'a.b.c');
   * // => true
   *
   * _.has(object, ['a', 'b', 'c']);
   * // => true
   * \`\`\`
   */
  static has(object: Record<string, RhSafeAny>, path: Array<string> | string): boolean;
  /**
   * 从给定对象中返回指定路径列表的值，返回值为一个数组
   * @param object 给定对象
   * @param paths 指定对象的指定路径
   * @example
   * \`\`\`ts
   * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
   * _.at(object, ['a[0].b.c', 'a[1]']);
   * // => [3, 4]
   * \`\`\`
   */
  static at(object: Record<string, RhSafeAny>, paths: string[]): RhSafeAny[];
  static get(object: Record<string, RhSafeAny>, path: string | string[]): RhSafeAny;
  static equal(obj1: Record<string, RhSafeAny>, obj2: Record<string, RhSafeAny>): boolean;
  /** 判断object对象是否等于空对象(\`{}\`) */
  static isEmptyObject(obj: Record<string, RhSafeAny>): boolean;
  /**
   * 生成默认的传输对象
   * @param enableTimestamp 时间戳 是否启用时间戳，防止动态form的ngOnChange(rhValue)方法不触发
   * @returns
   */
  static createRhBaseDto(enableTimestamp?: boolean): RhBaseDto;
  /** 初始化搜索模型
   * @param searchAll 是否搜索全部，默认为\`true\`
   */
  static createRhBaseQueryDto(searchAll?: boolean): RhBaseQueryDto;
  static toBoolean(value: string | boolean): boolean | null;
  /** 从给定的对象中，按照给定的属性列表，组成一个新的对象并返回
   * @param obj 需要操作的对象
   * @param propertyDatas 指定的属性列表
   */
  static pick<T extends Record<string, RhSafeAny>, K extends keyof T>(obj: T, propertyDatas: K[]): Partial<T>;
  /** 返回属性值不为空(undefined null '')的属性列表组成的对象 */
  static compact<T extends Record<string, RhSafeAny>>(obj: T): Record<string, any>;
  static omit<T extends Record<string, RhSafeAny>>(obj: T, paths: string[]): _.Omit<T, string>;
  static omitBy<T extends Record<string, RhSafeAny>>(obj: T, predicate: (value: RhSafeAny) => boolean): _.Dictionary<any>;
}

declare class ArrayHelper {
  /**
   * 向数组中添加或更新对象
   * @param list 目标数组
   * @param dto 要添加的对象
   * @param predicate 定位到该对象的方法
   * @param isFirst 是否加到头部,默认为\`true\`,
   * @param forceUpdate 当\`predicate\`为\`true\`时，是否强制更新，默认为\`false\`
   * @description 当目标数组已存在该对象，可选忽略或者更新；不存在则将该对象添加到目标数组
   */
  static addTo<T>(list: T[], dto: T, predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean, isFirst?: boolean, forceUpdate?: boolean): T[];
  /**
   * 移除数组中的元素
   * @param list 目标数组
   * @param predicate 定位到要删除元素的方法
   */
  static remove<T>(list: T[], predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean): T[];
  /**
   * 使用给定的长度分割源数组，返回分割后的二维数组。
   * @param array 源数组
   * @param size 数组长度
   */
  static Chunk(array: RhSafeAny[], size?: number): any[][];
  /**
   * 从给定的数组中筛选不重复的值，并返回新的数组
   * @param array 给定数组
   */
  static uniq<T>(array: Array<T>): Array<T>;
  /**
   * 使用给定的比较器比较数组中的每个数组，并返回由不重复值组成的新数组
   * @param array 给定数组
   * @param comparator 自定义比较器
   */
  static uniqWith<T>(array: Array<T>, comparator: (object: RhSafeAny, other: RhSafeAny) => boolean): Array<T>;
  /**
   * 筛选给定数组内值为true(除去false, null, 0, "", undefined, 和 NaN)的成员组成的新数组
   * @param array 给定的数组
   * @example
   */
  static compact<T>(array: Array<T>): Array<T>;
  /**
   * 使用目标数字筛选源数组中缺少的元素组成的数组，并返回。
   */
  static differenceBy<T>(source: Array<T>, target: Array<T>, propertyName: string): T[];
  static drop(arr: Array<RhSafeAny>, count?: number): any[];
  static dropRight(arr: Array<RhSafeAny>, count?: number): any[];
  static take(arr: Array<RhSafeAny>, count?: number): any[];
  static takeRight(arr: Array<RhSafeAny>, count?: number): any[];
  /** 拼接两个数组 */
  static concat(arr1: Array<RhSafeAny>, arr2: Array<RhSafeAny>): any[];
}

type OperationType = 'add' | 'subtract' | 'multiply' | 'divide';
/**
 * NumberHelper 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * NumberHelper.add(0.1, 0.2) output: 0.3
 * NumberHelper.multiply(19.9, 100) output: 1990
 *
 */
declare class RhNumberHelper {
    /** 判断是否是整数 */
    static isInteger(num: number): boolean;
    static toInteger(floatNum: number): {
        times: number;
        num: number;
    };
    static operation(a: number, b: number, digits: number, op: OperationType): number;
    static add(a: number, b: number, digits?: number): number;
    static subtract(a: number, b: number, digits?: number): number;
    static multiply(a: number, b: number, digits?: number): number;
    static divide(a: number, b: number, digits?: number): number;
}

type RhMimeType = 'text/plain' | 'application/json';
declare class FileHelper {
    /**
     * 通过get方法获取二进制文件流(TXT格式)
     */
    static GetFileText(url: string, params?: HttpParams | {
        [param: string]: string | string[];
    }): Observable<any>;
    /**
     * 通过Post方法获取文件文本信息
     * @param url 接口地址
     * @param body 表体，可传入后端定义的参数
     */
    static PostFileText(url: string, body: any): Observable<any>;
    /**
     * 通过get方法获取二进制文件流
     */
    static GetFileBlob(url: string, params?: HttpParams | {
        [param: string]: string | string[];
    }): Observable<Blob>;
    /**
     * 通过post方法获取文件
     * @param url 接口地址
     * @param body 表体
     * @param params http表头参数
     */
    static PostFileBlob(url: string, body?: any, params?: HttpParams | {
        [param: string]: string | string[];
    }): Observable<Blob>;
    /**
     * 创建blob的下载地址
     * @param blob blob数据
     */
    static CreateDownloadFileUrl(blob: Blob): string;
    /**
     * 创建blob的安全的下载地址(防止浏览器提示不安全的链接导致无法打开)
     * @param blob blob数据
     */
    static CreateDownloadTrustUrl(blob: Blob): any;
    /**
     * 通过get的方式下载文件
     * @param url 转化blob获得的网址，参见\`CreateDownloadFileUrl\`方法
     * @param fileName 文件名称，必须知道文件后缀，否则无法解析。
     */
    static downloadFileViaGet(url: string, fileName: string): void;
    static AutoDownloadFile(content: Blob, fileName: string): void;
    /**
     * 通过post的方式下载文件
     * @param url 转化blob获得的网址，参见\`CreateDownloadFileUrl\`方法
     * @param fileName 文件名称，必须知道文件后缀，否则无法解析。
     */
    static downloadFileViaPost(url: string, body: any, fileName: string): Promise<void>;
    static PrintLabelFile(labelContent: any): void;
    /**
     * 获取客户端打印软件地址
     * @param userIp 用户Ip
     * @param openMode 打开方式(1为不打开打印确认框)，（15：老模式边框过大 16:新模式，无边框）
     * @param suffix 后缀字符串(\`FlowCardExcel\`流转卡打印)
     * @deprecated 已弃用，请使用\`getPrintLabelClientUrlNew\`
     */
    static getPrintLabelClientUrl(userIp: string, openMode: RhPrintMode | number, suffix?: string): string;
    static getPrintLabelClientUrlNew(userIp: string): string;
    /**
     * 将网页中的table数据导出为excel
     * @param dataset 前端Table对应的数据源（当无数据时禁止导出）
     * @param tableName 要导出的table在html中的id值，必须设置
     * @param fileName 设置导出文件名称
     */
    static exportTableData(dataset: any[], tableName: string, fileName: string): void;
    /**
     * 使用sheetjs导出excel
     * @param dataset 要导出的数据列表
     * @param filename 文件名称
     * @param sheetname excel数据表名称
     * @param mappedDatas 中英文对照表
     */
    static exportExcelFile(dataset: any[], filename: string, sheetname: string, mappedDatas?: RhTableDisplayDto[]): Promise<boolean>;
    static saveAsExcelFile({ buffer, fileName }: {
        buffer: any;
        fileName: string;
    }): void;
    static getRelatedDisplayName(name: string, mappedDatas: RhTableDisplayDto[]): WithNil<string>;
    /**
     * 使用sheetjs导出excel(可格式化数据的导出（前端导出）)
     * @param dataset 要导出的数据列表
     * @param filename 文件名称
     * @param sheetname excel数据表名称
     * @param mappedDatas 中英文对照表
     */
    static formatExportExcelFile(dataset: any[], filename: string, sheetname: string, mappedDatas?: RhTableDisplayDto[]): Promise<boolean>;
    static exportDataHandler(key: string, mappedDatas: RhTableDisplayDto[], ele: Record<string, RhSafeAny>, temp: Record<string, RhSafeAny>): Record<string, RhSafeAny>;
    /**
     * 通过url直接下载，模拟点击
     * @param url 目标url
     */
    static downloadDirect(url: string): void;
    /**
     *
     * @param content 数据源
     * @param filename 文件名称,如：hello.json,hello.txt
     * @param type 文件类型(MIME 类型)
     * @description 如果是导出\`json\`，\`content\`需要使用\`JSON.stringify()\`进行序列化
     */
    static downloadByContent(content: RhSafeAny, filename: string, type: RhMimeType): void;
    static downloadByDataUrl(content: RhSafeAny, filename: string, type: RhMimeType): void;
    static downloadByBlob(blob: Blob, filename: string): void;
    static base64ToBlob(base64: string, type: RhMimeType): Blob;
    static base64ToFile(base64: string, filename: string): File;
    /** 将文件或者blob转换成base64
     * @description 读取成功会返回base64信息，读取失败后会返错误信息
     * @param data:blob或者file对象
     */
    static blobOrFileToBase64(data: Blob | File): Promise<string | ArrayBuffer | null>;
}
declare class FlowchartHelper {
    /**
     * 工艺路线明细转化为流程图
     * @param dataset 工艺流程明细
     * @returns 流程图模型 GraphLinksModel
     */
    static transformProcessInfoDatasToDiagramDisplayDto(dataset: ProcessRoutingEntryDto[]): go.GraphLinksModel;
}
declare class DateHelper {
    /** 北京当地时间(比全球时间多八个小时)，时间问题后端已进行统一处理  */
    static now(): Date;
    static isDate(value: any);
    /**
     * 使用指定字符串初始化日期
     * @description 字符串需要符合日期格式
     * @param value 字符串
     */
    static getDate(value: string): Date;
    /**
     * 返回给定日期加上指定小时数的日期
     * @param hours 小时数
     * @param date 给定日期
     */
   static addHours(hours: number, date: Date): Date;
   /**
    * 返回给定日期加上指定天数的日期
    * @param days 天数
    * @param date 给定日期
    */
    static addDays(days: number, date: Date): Date;
    /**
     * 返回给定日期加上指定小数的日期
     * @param month 小时数
     * @param date 给定日期
     */
   static addMonth(month: number, date: Date): Date;
   /**
   * 返回给定日期加上指定年数的日期
   * @param year 年数
   * @param date 给定日期
   */
   static addYear(year: number, date: Date): Date;
   /**
   * 格式化日期
   * @param date 日期
   * @param formatDate 格式，如'yyyy-MM-dd HH:mm:ss'
   * @param options 可选项
   */
   static format(date: Date | number, formatDate = 'yyyy-MM-dd HH:mm:ss', options?: any): string;
   /**
    * 是否是过去的日期
    * @param date 日期
    */
    static IsPast(date: Date | number): boolean;
    /**
     * 返回给定日期月份的第一天
     * @param date 日期
     */
    static startOfMonth(date: Date | number): Date;
   /**
     * 返回给定日期月份的最后一天
     * @param date 日期
     */
    static endOfMonth(date: Date | number): Date;
    /**
     * 返回给定日期的周的第一天
     * @param date 日期
     */
    static startOfWeek(date: Date | number, options = { weekStartsOn: 1 }): Date;
    /**
     * 返回给定日期的周的最后一天
     * @param date 日期
     */
    static endOfWeek(date: Date | number, options = { weekStartsOn: 1 }): Date;
    /**
     * 返回给定日期的开始时间
     * @param date 日期
     */
    static startOfDay(date: Date | number): Date;
    /**
     * 返回给定日期的结束时间
     * @param date 日期
     */
    static endOfDay(date: Date | number): Date;
    static getMonth(date: Date);
    /**
     * 转成当地时间(转换为北京时间)
     * @param date 日期
     * @param timeZone 时区，默认为东八区(北京时区)
     */
    static convertToLocalTime(date: Date, timeZone = 8): Date;
    static getHours(date: Date): number;
    static differenceInMinutes(startDate: Date, endDate: Date): number;
    static differenceInSeconds(startDate: Date, endDate: Date): number;
    /** 返回给定日期的0点0分0秒 */
    static getDateStartTime(date: Date): Date;
    /** 返回给定日期的23点59分59秒 */
    static getDateEndTime(date: Date): Date;
    /**
     * 返回前n天的日期
     * @param num 第几天
     */
    static getPreviousDate(num: number);
}

declare class RhTreeHelper {
    /**
     * 将RhMenusDto数组转换成RhMenuNodeDto数据,便于左侧主菜单展示
     * @param rootData 菜单根节点
     * @param originDatas 菜单数据
     * @param defaultIcon 默认图标
     */
    static initMenuTreeNodes(rootData: RhMenusDto, originDatas: RhMenusDto[], defaultIcon: string): RhMenuNodeDto[];
    /**
     * 初始化一棵树
     * @param ygTreeNode 初始化根节点的数据
     * @param treeSer 注入的NzTreeService
     * @param hideInvisible 是否隐藏不可见的菜单,默认为false
     * @param isExpandRootNode 是否默认展开根节点,默认为true
     * @param setUseFeatureMenuAsNotLeaf 是否将有功能数据的菜单设置为非叶子节点,默认为false
     */
    static ToNzTreeNodes(
      ygTreeNode: RhTreeNode,
      treeSer: NzTreeService,
      hideInvisible = false,
      isExpandRootNode = true,
      setUseFeatureMenuAsNotLeaf = false
    ): NzTreeNode[];
    /** 初始化节点状态 未选中，折叠 */
    static InitNzTreeNodes(rootTreeNode: NzTreeNode): void;
    /** 获取选中的节点列表集合 */
    static GetCheckedTreeNodeList(rootTreeNode: NzTreeNode): NzTreeNode[];
    /** 移除树的节点 */
    static RemoveTreeNode(treeNode: NzTreeNode): void;
    /** 清除菜单的选中和开启状态 */
    static clearStatus(node: NzTreeNodeOptions | NzTreeNodeOptions[], clearSelect = true, clearOpen = true): void;
    /** 清除树的选中和展开状态 */
    static clearTreeStatus(targetNode: NzTreeNode | NzTreeNode[], clearSelect = true, clearOpen = true, exceptNode?: NzTreeNode): void;
    /**
     * 递归折叠树或指定的树节点
     * @param node 树节点或者树的数据源
     */
    static collapseTree(node: NzTreeNode | NzTreeNode[]): void;
    /**
     * 根据父节点递归获取子节点的节点数组
     * @param node 父节点
     * @param expectParent 是否包含父节点
     */
    static getNodeDatasetViaParentNode(node: NzTreeNode, expectParent = false): NzTreeNode[];
    /**
     * 根据父节点返回子节点的Menu对象数组
     * @param node 父节点
     * @param expectParent 是否包含父节点
     */
    static getMenuDatasetViaParentNode(node: NzTreeNode, expectParent = false): RhMenusDto[];
    /**
     * 返回选中菜单节点对应的路由地址
     * @param node 菜单节点
     */
    static getFullUrl(node: NzTreeNode, defaultMainUrl = 'main');
    /**
     *
     * @param treeNode 要添加到的树节点
     * @param ygNode 要添加的节点对象
     * @param hideVisible 是否隐藏不可见的节点
     * @param setUseFeatureMenuAsNotLeaf 是否将有功能数据的菜单设置为非叶子节点,默认为false
     */
    static AddNode(treeNode: NzTreeNode, ygNode: RhTreeNode, hideVisible = false, setUseFeatureMenuAsNotLeaf = false);
    /**
     * 转换数据源为组件节点数组
     * @param dataSource 数据源
     * @param mappedKeys 转换字段映射对应key
     */
    static transformToNodes<T extends Record<string, RhSafeAny>>(dataSource: T[], mappedKeys: mappedType, isLeaf?: boolean);
    /**
     * 通过节点key,获取指定节点数据
     * @param dataNodes 节点数据源
     * @param selectedNodeKeys 已选中节点Key
     */
    static getSelectedNodes(dataNodes: NzTreeNode[], selectedNodeKeys: string[]);
    /**
     * 获取指定节点的所有父节点数据
     * @param selectedNode 选中的节点
     */
    static getAllParentNodes(selectedNode: NzTreeNode);
    /**
     * 通过父节点数据，递归返回添加所有子节点的父节点
     * @param parentNode 父节点
     * @param mappedData 转换字段映射组
     * @param data 父节点对应数据
     */
    static transformToSignalNode<T extends Record<string, RhSafeAny>>(parentNode: NzTreeNode, mappedData: mappedType, data: T): NzTreeNode;
    /**
     *
     * @param menuNode 菜单节点对象
     * @param nodeList 菜单数据
     * @param defaultIcon 默认图标
     */
    static addMenuTreeNode(menuNode: RhMenuNodeDto, nodeList: RhMenusDto[], defaultIcon: string);
}

interface IDefaultSetting {
  /** 当前语言 */
  lang: string;
  [key: string]: string;
}
declare class RhStorageService {
  private storage;
  private _defaultSetting;
  private _userSessionKey;
  get defaultSetting(): IDefaultSetting;
  constructor();
  /**
   * 登出后清除local storage信息
   */
  cleanLoggedInStorage(): void;
  store(key: string, value: RhSafeAny | string, omitPaths?: string[]): void;
  remove(key: string): void;
  get(key: string): RhSafeAny;
  getAppConfig(): RhAppConfigDto | null;
  storeAppConfig(dto: RhAppConfigDto): void;
  removeAppConfig(): void;
  storeProjectConfig(dto: RhProjectConfigDto): void;
  /**
   * 存储用户信息
   * @param userSession 用户记录
   */
  storeUserSession(userSession: RhUserSessionDto): void;
  getUserSession(ignore?: boolean): RhUserSessionDto | null;
  removeUserSession(): void;
  getFactoryCode(): string;
  /**
   * 设置userssion内user.login的值
   * @param status 登录状态
   * @description 向已经存在的usersession里最佳当前的用户登录状态
   */
  setLoginStatus(status: boolean): void;
  /**
   * 启用用户单点登录控制（当\`appconfig.json\`的\`SSOEnable\`置为\`true\`时生效）
   * @param identifier 是否启用单点登录标识。一般存储在ProjectConfig中
   * @description 只有当\`guestIdentity\`的值为\`AuthenUser\`时，才会启用单点登录控制，
   * 具体逻辑参见\`[默认加载器](../net/default.interceptor.ts)\`
   */
  enableUserAuthority(identifier: string): void;
  /**
   * 获取单点登录信息
   */
  getUserAuthority(): string;
  /**
   * 获取当前菜单的操作权限模型
   */
  getAuthorityData(): RhMenuFeatureAuthorityDto | null;
  /**
   * 存储当前菜单的操作权限模型
   * @param data 菜单权限数据
   */
  storeAuthorityData(data: RhMenuFeatureAuthorityDto): void;
  /** 获取当前是否处于调试状态 */
  getDebug(): boolean;
  storeDebug(status: boolean): void;
  removeDebug(): void;
  setDefaultSetting(name: string | IDefaultSetting, value?: RhSafeAny): boolean;
  getDefaultSetting(): IDefaultSetting | null;
  _frequentComponentDataSet: RhComponentPoolDataDto | null;
  getFrequentComponentDatas(): RhComponentPoolDataDto;
  storeFrequentComponentDatas(data: RhComponentPoolDataDto): void;
  removeFrequentComponentDatas(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<RhStorageService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<RhStorageService>;
}
declare class I18nHelper {
    /**
     * 翻译方法
     * @param path 路径
     * @param data 翻译辅助数据，用来做替换操作
     * @returns 翻译后的文本呢
     */
    static translate(path: string, data?: Record<string, RhSafeAny> | string | number): string;
    /**
   * 语言字符串处理
   * @param lang 语言
   * @description 将形如\`zh_CN\`的语言字符串转换为\`zh-CN\`
   */
  static langStrHandler(lang: RhLangType): string
}
declare class FunctionHelper {
    static confirm(predicate: () => boolean, confirmInfo: string, action: () => void);
    /**
     * 去除路由地址上的查询参数和片段
     * @example 形如\`main/ProductMaster/ProcessRoutingManage?routingcode=1000005127\`
     * 返回值为\`main/ProductMaster/ProcessRoutingManage\`
     */
    static removeRouteQueryPara(value: string): string;
    static debounce(func: (...args: RhSafeAny) => void, wait = 0, optons = {});
    static throttle(func: () => void, wait = 0, optons = {});
    /** 接口返回\`OpResult\`时的一般操作方法
     * @param result \`OpResult\`对象
     * @param msg 提示信息，一般为操作的描述
     * @param msgType 当\`result.Success\`为假时的提示类型，只兼容\`warning\`和\`error\`
     * @param msgCategory 提示信息类型，\`message\`提示或者\`modal\`对话框提示
     */
    static handlerOpResult(result: OpResult, msg: string, msgType: RhMsgType = 'warning', msgCategory: RhMsgCategory = 'modal');
    /**
     *
     * @param result 要操作的DataResultT<T>类型
     * @param successFn 成功时的回调
     * @param failFn 失败时的回调
     */
    static handlerDataResultT<T>(result: DataResultT<T>, successFn: (data: T) => void, failFn: (data?: T) => void);
    /** 检查目标值是否是null或者undefined */
    static isNil(data: RhSafeAny);
    /** 将制定的信息复制到剪贴板 */
    static copyInfo(content: string);
    static booleanHandler(value: boolean);
    static selectItemHandler(value: string, pipeDatas: RhSelectItem[], dataValue = 'Value', dataText = 'Text'): string;
    }
  `;
