export interface Staff {
  id: number;
  email: string;
  password_hash: string;
  name: string;
}

export interface jwtPayload {
  id: number;
  email: string;
}
