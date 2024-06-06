/** 处理器类型 */
export enum XOperationKeys {
  /** 执行自定义脚本 */
  EXECUTE_SCRIPT = 'execute_script',
  REQUEST_API = 'request_api',
  CREATE_MODEL = 'create_model',
  UPDATE_DATASET = 'update_dataset',
  OPEN_MODAL = 'open_modal',
  CLOSE_MODAL = 'close_modal',
  SUBSCRIBE_SIGNALR_DATA = 'subscribe_signalr_data',
  INVOKE_SIGNALR_METHOD = 'invoke_signalr_method',
  /** 执行复用逻辑 */
  EXECUTE_TEMPLATE = 'execute_template',
  UPDATE_INSTANCE_VALUE = 'update_instance_value',
  GET_INSTANCE_VALUE = 'get_instance_value',
  SHOW_MESSAGE = 'show_message',
  CONSOLE = 'console',
  SHOW_CONFIRM_MODAL = 'show_confirm_modal',
  CONTROL_INSTANCE = 'control_instance',
  CONTROL_SAME_INSTANCES = 'control_same_instances',
  BRANCH_OPERATIONS = 'branch_operations',
  UPDATE_VARIABLE_VALUE = 'update_variable_value',
  GET_VARIABLE_VALUE = 'get_variable_value',
  SHOW_GLOBAL_LOADING = 'show_global_loading',
  CLOSE_GLOBAL_LOADING = 'close_global_loading',
  SWITCH_OPERATIONS = 'switch_operations',
  DISPLAY_DATA = 'display_data',
}
