// src/lib/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
