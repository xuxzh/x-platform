export class RhOpHistory {
  constructor(
    public value: string | number | boolean,
    public createTime: Date = new Date()
  ) {}
}
