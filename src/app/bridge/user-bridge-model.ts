import { UserModel, SimplifiedUser } from '../models/user.model'; // the detailed one


export class User {
  static toSimplifiedUser(apiUser: UserModel): SimplifiedUser {
    return {
      name: apiUser.firstName,
      email: apiUser.email,
      role: apiUser.role?.name || 'unknown',
      permissions: apiUser.role?.permissions || [],
      password: apiUser.credentials?.password || undefined,
      google_user_id: apiUser.credentials?.authId || undefined,
    };
  }

  static fromSimplifiedUser(simpleUser: SimplifiedUser): Partial<UserModel> {
    return {
      firstName: simpleUser.name,
      email: simpleUser.email,
      credentials: {
        password: simpleUser.password ?? null,
        authId: simpleUser.google_user_id ?? null,
        authProvider: simpleUser.google_user_id ? 'google' : 'internal',
        userId: '', // must be filled where used
        id: '', // must be filled where used
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
        deleted: false,
        deletedOn: null,
        deletedBy: null,
        createdBy: null,
        modifiedBy: null,
        authToken: null,
        secretKey: null,
      },
      role: {
        name: simpleUser.role,
        permissions: simpleUser.permissions ?? [],
        id: '',
        tenantId: '',
        roleType: 1,
        deleted: false,
        createdOn: new Date().toISOString(),
        modifiedOn: new Date().toISOString(),
        createdBy: null,
        modifiedBy: null,
        deletedOn: null,
        deletedBy: null,
        description: null,
        allowedClients: null,
      },
    };
  }
}
