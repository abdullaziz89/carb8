package com.cdph.document.storage.controller;

import com.cdph.document.storage.service.StorageService;
import org.apache.tika.Tika;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/")
public class FileController {

    private final StorageService storageService;

    @Autowired
    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping()
    public String hello() {
        return "Hello from file controller";
    }

    @GetMapping("/{directory}/{id}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<?> serveFile(@PathVariable @NotNull String directory, @PathVariable String id, @PathVariable String filename) {
        try {
            return fileServingConfig(storageService.loadAsResource(directory + "/" + id, filename));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/business/{business}/{directory}/{documentId}")
    public ResponseEntity<List<Object>> getAll(@PathVariable("business") String business, @PathVariable("directory") String directory, @PathVariable("documentId") String documentId) {
        String ss = business + "/" + directory;
        return ResponseEntity.ok(this.storageService.load(documentId, ss));
    }

    @GetMapping("/{project}/{directory}/{id}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<?> serveFile1(@PathVariable @NotNull String project, @PathVariable @NotNull String directory, @PathVariable String id, @PathVariable String filename) {
        try {
            return fileServingConfig(storageService.loadAsResource(project + "/" + directory + "/" + id, filename));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{directory}/{documentId}")
    public ResponseEntity<List<Object>> getAll(@PathVariable("directory") String directory, @PathVariable("documentId") String documentId) {
        return ResponseEntity.ok(this.storageService.load(documentId, directory));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam @NotNull MultipartFile file, @RequestParam String path) {

        boolean isStored = this.storageService.store(file, path);

        String[] paths = path.split("/");
        String directory = paths[0];
        String documentId = paths[paths.length - 1];

        if (isStored) {
            return this.getAll(directory, documentId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<?> uploadMultiple(@RequestParam @NotNull MultipartFile[] files, @RequestParam String path) {

        boolean isStored = this.storageService.store(files, path);

        String[] paths = path.split("/");
        if (paths.length == 3) {
            String p1 = paths[0];
            String p2 = paths[1];
            String p3 = paths[2];

            paths = new String[2];
            paths[0] = p1 + "/" + p2;
            paths[1] = p3;

        }

        String directory = paths[0];
        String documentId = paths[paths.length - 1];

        if (isStored) {
            return this.getAll(directory, documentId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }

    @GetMapping("/getFiles/{document}")
    public ResponseEntity<?> getAllFiles(@PathVariable("document") @NotNull String document) {
        return ResponseEntity.ok().body(this.storageService.compressFiles(document.toLowerCase()));
    }

    @GetMapping("/download/{directory}/{id}/{filename:.+}")
    @ResponseBody
    public ResponseEntity<?> downloadFile(@PathVariable String directory, @PathVariable String id, @PathVariable String filename) {
        return ResponseEntity.ok().body(storageService.loadAsResource(directory + "/" + id, filename));
    }

    @DeleteMapping("/{directory}/{id}")
    public ResponseEntity<Boolean> deleteDirectory(@PathVariable String directory, @PathVariable String id) {
        System.out.println("Deleting directory: " + directory + "/" + id);
        return ResponseEntity.ok().body(this.storageService.deleteDirectory(directory, id));
    }

    @DeleteMapping("/{directory}/{id}/{filename:.+}")
    public ResponseEntity<Boolean> deleteFile(@PathVariable String directory, @PathVariable String id, @PathVariable String filename) {
        System.out.println("Deleting file: " + directory + "/" + id + "/" + filename);
        return ResponseEntity.ok().body(this.storageService.delete(directory + "/" + id + "/" + filename));
    }

    private @NotNull ResponseEntity<Resource> fileServingConfig(@NotNull Resource resource) throws IOException {

        HttpHeaders header = new HttpHeaders();
        header.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + resource.getFilename());
        header.add("Cache-Control", "no-cache, no-store, must-revalidate");
        header.add("Pragma", "no-cache");
        header.add("Expires", "0");

        Tika tika = new Tika();
        String contentType = tika.detect(resource.getURL());

        return ResponseEntity.ok()
                .headers(header)
                .contentLength(resource.contentLength())
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
