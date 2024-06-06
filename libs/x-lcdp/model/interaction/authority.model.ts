/** 管控实例权限 */
export class RhInstanceAuthority {
  constructor(
    /** 实例可见 */
    public visible = true,
    /** 按钮禁用（待实现） */
    public disabled?: boolean,
    /** 屏蔽事件（待实现） */
    public silent?: {
      mode: 'inList' | 'outList' | 'all';
      list: string[];
    }
  ) {}
}
/** 注册实例权限信息 */
export interface RhInstanceAuthorityRegistration {
  /** 实例Key值 */
  instanceKey: string;
  /** 实例权限 */
  authority: RhInstanceAuthority;
}
