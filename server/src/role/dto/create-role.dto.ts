export class CreateRoleDto {

  id: string;
  name: string;
  enable: boolean;

  constructor(id: string, name: string, enable: boolean) {
    this.id = id;
    this.name = name;
    this.enable = enable;
  }
}
