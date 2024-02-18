import { Injectable } from '@nestjs/common';
import { MyCustomStorageEngine } from "./MyCustomStorageEngine";
import * as multer from 'multer';

@Injectable()
export class FileService {
  private storageEngine: MyCustomStorageEngine;

  constructor() {
    this.storageEngine = new MyCustomStorageEngine();
  }

  async uploadFile(file: any, dynamicDestination: string) {
    this.storageEngine.setDestination(dynamicDestination);

    const result = await new Promise((resolve, reject) => {
      const upload = multer({ storage: this.storageEngine.storage() }).single('file');
      upload(file, null, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            destination: dynamicDestination,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
          });
        }
      });
    });

    return result;
  }
}
