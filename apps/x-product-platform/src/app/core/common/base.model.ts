export class BaseAudit {
  Creator?: string;
  CreateTime?: Date;
  LastModifiedTime?: Date | string;
  LastModifier?: string;
}

export class BaseModel extends BaseAudit {
  Id!: string;
}
