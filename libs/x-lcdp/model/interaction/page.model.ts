import { IComponentSchema, RhEventsListenersDataset } from '../designer.model';
import { RhDataSource } from './datasource.model';
import { RhExtensionPack, RhExtensionPackOutputs } from './extension.model';
import { RhModel } from './model-field.model';
import { RhPageResourceGroup } from './resources.model';
import { RhVariable } from './variable.model';

export type RhComponentTemplates = Record<string, IComponentSchema>;
export type RhHandlersTemplates = RhEventsListenersDataset;
export type RhModelsDataset = RhPageResourceGroup<RhModel>;
export type RhVariablesDataset = Record<string, RhVariable>;
export type RhDataSourcesDataset = RhPageResourceGroup<RhDataSource>;
export type RhExtensionsDataset = RhPageResourceGroup<RhExtensionPack>;
export type RhPageResourceTypes =
  | 'models'
  | 'variables'
  | 'dataSources'
  | 'handlers'
  | 'extensions';
export type RhSelectablePageResourceTypes = Exclude<
  RhPageResourceTypes,
  'extensions'
>;

export class RhPageResources {
  constructor(
    /** 复用逻辑 */
    public handlers: RhHandlersTemplates = {},
    /** 数据模型 */
    public models: RhModelsDataset = {},
    /** 数据变量 */
    public variables: RhVariablesDataset = {},
    /** 数据源 */
    public dataSources: RhDataSourcesDataset = {},
    /** 子模块（原旧版嵌入式扩展包） */
    public extensions: RhExtensionsDataset = {}
  ) {}
}

export class RhPageProps extends RhPageResources {
  constructor(
    public override handlers: RhHandlersTemplates = {},
    public override models: RhModelsDataset = {},
    public override variables: RhVariablesDataset = {},
    public override dataSources: RhDataSourcesDataset = {},
    public override extensions: RhExtensionsDataset = {},
    public stage: RhPageStageConfig = new RhPageStageConfig(),
    public outputs: RhExtensionPackOutputs = new RhExtensionPackOutputs(),
    /** 自定义CSS */
    public customCss?: string,
    /** 操作步骤id。唯一自增id。用于在扩展包中定位到目标操作，以对外触发事件、 */
    public optId?: number
  ) {
    super(handlers, models, variables, dataSources);
  }
}

// export type RhPage = IComponentSchema & {
//   'x-component-props': RhPageProps;
//   subPages: IComponentSchema[];
// };

export class RhPageStageConfig {
  constructor(public width = 1366, public height = 768, public scale = 100) {}
}
