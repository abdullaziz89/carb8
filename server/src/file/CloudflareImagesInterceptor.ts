import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";

@Injectable()
export class CloudflareImagesInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const files = request.files;

        if (!files) {
            throw new Error('No files uploaded');
        }

        for (const file of files) {
            // Convert file to Blob object
            request.files[files.indexOf(file)].buffer = Buffer.from(file.buffer);
        }

        return next.handle();
    }
}
