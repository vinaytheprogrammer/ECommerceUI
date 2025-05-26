
export interface AuthUser {
    username: string;
    email: string;
    role: string;
    id: string;
    google_user_id ?: string; // Optional field for Google users
  }
  
export interface User {
  user_id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions?: string[];
  google_user_id?: string; // Optional field for Google users
}
