export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  roles: string[];
}