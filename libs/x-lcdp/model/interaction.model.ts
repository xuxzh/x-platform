export default void 0;

// export class RhPageResources {
//   constructor(
//     /** 复用逻辑 */
//     public handlers: RhHandlersTemplates = {},
//     /** 数据模型 */
//     public models: RhModelsDataset = {},
//     /** 数据变量 */
//     public variables: RhVariablesDataset = {},
//     /** 数据源 */
//     public dataSources: RhDataSourcesDataset = {},
//     /** 子模块（原旧版嵌入式扩展包） */
//     public extensions: RhExtensionsDataset = {}
//   ) { }
// }
// export class RhPageProps extends RhPageResources {
//   constructor(
//     public override handlers: RhHandlersTemplates = {},
//     public override models: RhModelsDataset = {},
//     public override variables: RhVariablesDataset = {},
//     public override dataSources: RhDataSourcesDataset = {},
//     public override extensions: RhExtensionsDataset = {},
//     public stage: RhPageStageConfig = new RhPageStageConfig(),
//     public outputs: RhExtensionPackOutputs = new RhExtensionPackOutputs(),
//     /** 自定义CSS */
//     public customCss?: string,
//     /** 操作步骤id。唯一自增id。用于在扩展包中定位到目标操作，以对外触发事件、 */
//     public optId?: number
//   ) {
//     super(handlers, models, variables, dataSources);
//   }
// }
