export default class User {
  id: string;
  email: string;
  name: string;
  password: string;
  roleId: string;
  enable: boolean;
  providerId: string;
  provider: string;

  constructor(id: string, email: string, name: string, password: string, roleId: string, enable: boolean, provider: string, providerId?: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.roleId = roleId;
    this.enable = enable;
    this.provider = provider;
    this.providerId = providerId;
  }
}
