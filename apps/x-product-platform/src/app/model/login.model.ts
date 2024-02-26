export interface LoginDto {
  UserCode: string;
  Password: string;
}

export interface IToken {
  accessToken: string;
  refreshToken: string;
}
