import { XHttpMethod } from '@x/base/model';
export type RhDataSource =
  | RhWebApiDataSource
  | RhDbDataSource
  | RhJsonDataSource;

export class RhWebApiDataSource {
  public port?: number | string;
  constructor(
    public type: 'webApi' = 'webApi',
    public method: XHttpMethod = 'POST',
    public url?: string,
    public ModuleName?: string,
    public controllerName?: string,
    public interfaceName?: string
  ) {}
}

export class RhDbDataSource {
  constructor(public type: 'db' = 'db') {}
}

export class RhJsonDataSource {
  constructor(public type: 'json' = 'json', public content = '') {}
}
