export class Role {

  id: string;
  name: string;
  enable: boolean;
  createDate: Date;
  modifyDate: Date;

  constructor(id: string, name: string, enable: boolean, createDate: Date, modifyDate: Date) {
    this.id = id;
    this.name = name;
    this.enable = enable;
    this.createDate = createDate;
    this.modifyDate = modifyDate;
  }
}
