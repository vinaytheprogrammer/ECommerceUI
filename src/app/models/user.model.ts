
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

// export interface UserModel {
//   id: string;
//   firstName: string;
//   lastName: string | null;
//   middleName: string | null;
//   username: string;
//   email: string;
//   phone: string | null;
//   photoUrl: string | null;
//   designation: string | null;
//   dob: string | null;
//   gender: string | null;
//   lastLogin: string | null;
//   authClientIds: string[] | null;
//   defaultTenantId: string | null;
//   default_tenant_id: string | null;

//   // Metadata
//   deleted: boolean;
//   deletedOn: string | null;
//   deletedBy: string | null;
//   createdOn: string;
//   modifiedOn: string;
//   createdBy: string | null;
//   modifiedBy: string | null;

//   credentials: UserCredentials;
//   role: UserRole;
// }

// export interface UserCredentials {
//   id: string;
//   userId: string;
//   authProvider: 'internal' | 'google' | string;
//   authId: string | null;
//   authToken: string | null;
//   secretKey: string | null;
//   password?: string | null;

//   // Metadata
//   deleted: boolean;
//   deletedOn: string | null;
//   deletedBy: string | null;
//   createdOn: string;
//   modifiedOn: string;
//   createdBy: string | null;
//   modifiedBy: string | null;
// }

// export interface UserRole {
//   id: string;
//   name: string;
//   description: string | null;
//   tenantId: string;
//   allowedClients: string[] | null;
//   roleType: number;
//   permissions: string[];

//   // Metadata
//   deleted: boolean;
//   deletedOn: string | null;
//   deletedBy: string | null;
//   createdOn: string;
//   modifiedOn: string;
//   createdBy: string | null;
//   modifiedBy: string | null;
// }
