export interface IMenuDto {
  MenuCode: string;
  MenuName: string;
  Children?: IMenuDto[];
}
