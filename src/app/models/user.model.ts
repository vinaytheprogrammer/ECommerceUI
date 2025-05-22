
export interface AuthUser {
    username: string;
    email: string;
    role: string;
    id: string;
  }
  
export interface User {
  user_id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions?: string[];
}
