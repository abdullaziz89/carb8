import { diskStorage } from 'multer';

export class MyCustomStorageEngine {
  private destination: string;

  constructor() {
    this.destination = '/uploads'; // Set a default value
  }

  public setDestination(destination: string): void {
    this.destination = destination;
  }

  public storage() {
    return diskStorage({
      destination: this.getDestination.bind(this),
      filename: (req, file, cb) => {
        // Generate unique file name
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileName = `${uniqueSuffix}-${file.originalname}`;
        cb(null, fileName);
      },
    });
  }

  private getDestination(req, file, cb) {
    cb(null, this.destination);
  }
}
