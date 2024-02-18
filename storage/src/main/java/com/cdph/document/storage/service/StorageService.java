package com.cdph.document.storage.service;

import com.cdph.document.storage.model.enums.FilesFor;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Stream;

public interface StorageService {

    void init();

    boolean store(MultipartFile file, String directory);

    boolean store(MultipartFile[] files, String directory);

    Stream<Path> loadAll();

    Path load(String filename, String directory, FilesFor filesFor);

    List<Object> load(String filename, String directory);

    List<Object> load(String pathURI);

    Resource loadAsResource(String directory, String filename);

    Boolean delete(String path);

    Boolean deleteDirectory(String directory, String id);


    void deleteAll();

    String compressFiles(String document);
}
