import type { AuthResult } from "./types";

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResult>;
  logout(): void;
}
