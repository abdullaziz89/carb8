package com.cdph.document.storage.service.impl;

import com.cdph.document.storage.config.property.DocumentStorageProperty;
import com.cdph.document.storage.exception.StorageException;
import com.cdph.document.storage.exception.StorageFileNotFoundException;
import com.cdph.document.storage.model.enums.FilesFor;
import com.cdph.document.storage.service.StorageService;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.compress.utils.IOUtils;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service("StorageServiceImpl")
public class StorageServiceImpl implements StorageService {

    static final Logger log = LoggerFactory.getLogger(StorageServiceImpl.class);
    private final Path rootLocation;

    @Autowired
    public StorageServiceImpl(DocumentStorageProperty properties) {

        String path = "uploads";

        this.rootLocation = Paths.get(path);
    }

    @Override
    public void init() {

        try {

            Files.createDirectories(rootLocation);
        } catch (IOException e) {

            log.warn("StorageServiceImpl RowMapper", e);
            throw new StorageException("Could not initialize storage", e);
        }
    }

    @Override
    public boolean store(@NotNull MultipartFile file, String directory) {

        boolean tbr = false;

        try {

            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }

            Path destinationFile = Paths.get(this.rootLocation.toString(), directory)
                    .resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename())))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(Paths.get(this.rootLocation.toString(), directory).toAbsolutePath())) {
                log.warn("StorageServiceImpl RowMapper", new StorageException("Cannot store file outside current directory."));
            }

            try {
                Files.createDirectories(Paths.get(this.rootLocation.toString(), directory));
            } catch (IOException e) {
                throw new StorageException("Could not create directory storage", e);
            }

            try (InputStream inputStream = file.getInputStream()) {
                tbr = Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING) > 0;
            }
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to store file.", e));
        }

        return tbr;
    }

    @Override
    public boolean store(MultipartFile[] files, String directory) {

        AtomicBoolean tbr = new AtomicBoolean(false);

        Arrays.stream(files).parallel().forEach(file -> {

            if (file.isEmpty()) {
                throw new StorageException("Failed to store empty file.");
            }

            Path destinationFile = Paths.get(this.rootLocation.toString(), directory)
                    .resolve(Paths.get(Objects.requireNonNull(file.getOriginalFilename())))
                    .normalize().toAbsolutePath();

            if (!destinationFile.getParent().equals(Paths.get(this.rootLocation.toString(), directory).toAbsolutePath())) {
                log.warn("StorageServiceImpl RowMapper", new StorageException("Cannot store file outside current directory."));
            }

            try {
                Files.createDirectories(Paths.get(this.rootLocation.toString(), directory));
            } catch (IOException e) {
                throw new StorageException("Could not create directory storage", e);
            }

            try (InputStream inputStream = file.getInputStream()) {
                tbr.set(Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING) > 0);
            } catch (IOException e) {
                log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to store file.", e));
            }
        });

        return tbr.get();
    }

    @Override
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.rootLocation, 1)
                    .filter(path -> !path.equals(this.rootLocation))
                    .map(this.rootLocation::relativize);
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to read stored files", e));
            return null;
        }
    }

    @Override
    public Path load(String filename, String directory, FilesFor filesFor) {

        Path p = null;
        try {

            String pathURI = this.rootLocation.toString() + "/" + directory + "/" + filename;

            Stream<Path> path = Files.walk(Paths.get(pathURI));
            List<Path> pathList = path.collect(Collectors.toList());

            if (filesFor == FilesFor.Stream) {
                p = pathList.get(0);
            } else if (filesFor == FilesFor.Object) {
                p = pathList.get(1);
            }
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to read stored files", e));
            return null;
        }
        return p;
    }

    @Override
    public List<Object> load(String filename, String directory) {

        try {
            String pathURI = this.rootLocation.toString() + "/" + directory + "/" + filename;

            File file = new File(pathURI);
            if (!file.exists()) {
                file.mkdirs();
            }

            Stream<Path> pathStream = Files.list(Path.of(pathURI));
            return pathStream.map(path -> {
                        if (Files.isDirectory(path)) {
                            Map<String, Object> list = new HashMap<>();
                            list.put(path.getFileName().toString(), load(path.getFileName().toString(), directory + "/" + filename));
                            return list;
                        }
                        return path.getFileName().toFile().getName();
                    }).sorted()
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to read stored files", e));
            return null;
        }
    }

    @Override
    public List<Object> load(String pathURI) {

        try {
            Stream<Path> pathStream = Files.list(Paths.get(rootLocation.toString() + File.separator + pathURI));
            return pathStream.map(path -> {
                if (Files.isDirectory(path)) {
                    Map<String, Object> list = new HashMap<>();
                    list.put(path.getFileName().toString(), load(pathURI + File.separator + path.getFileName().toString()));
                    return list;

                }
                return path.getFileName().toFile().getName();
            }).collect(Collectors.toList());
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Failed to read stored files", e));
            return null;
        }
    }

    @Override
    public Resource loadAsResource(String directory, String filename) {
        try {

            Path file = load(filename, directory, FilesFor.Stream);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {

                return resource;
            } else {
                log.warn("StorageServiceImpl RowMapper", new StorageException("Could not read file: " + filename));
                return null;
            }
        } catch (MalformedURLException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("Could not read file: " + filename, e));
            return null;
        }
    }

    @Override
    public Boolean delete(String directory) {
        String path = this.rootLocation.toString() + "/" + directory;
        try {
            File file = new File(path);
            if (file.isDirectory()) {
                FileUtils.deleteDirectory(new File(path));
                return true;
            } else if (file.isFile()) {
                return file.delete();
            }
            return true;
        } catch (NoSuchFileException exception) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("%s: no such" + " file or directory%n" + path, exception));
            return null;
        } catch (DirectoryNotEmptyException exception) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("%s not empty%n" + path, exception));
            return null;
        } catch (IOException exception) {
            // File permission problems are caught here.
            log.warn("StorageServiceImpl RowMapper", new StorageException("permission error for path: " + path, exception));
            return null;
        }
    }

    @Override
    public Boolean deleteDirectory(String directory, String id) {
        String path = this.rootLocation.toString() + File.separator + directory + File.separator + id;
        System.out.println(path);
        try {
            File file = new File(path);
            if (file.isDirectory()) {
                System.out.println("is directory");
                FileUtils.deleteDirectory(file);
                return true;
            }
            return true;
        } catch (NoSuchFileException exception) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("%s: no such" + " file or directory%n" + path, exception));
            return null;
        } catch (DirectoryNotEmptyException exception) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("%s not empty%n" + path, exception));
            return null;
        } catch (IOException exception) {
            // File permission problems are caught here.
            log.warn("StorageServiceImpl RowMapper", new StorageException("permission error for path: " + path, exception));
            return null;
        }
    }

    @Override
    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    @Override
    public String compressFiles(String document) {

        String path = this.rootLocation.toString() + "/" + document;
        File tempFile = null;
        try {
            tempFile = File.createTempFile(document + "Temp", ".zip");
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("error while creating temp zip file", e));
            return null;
        }

        try (ZipArchiveOutputStream archive = new ZipArchiveOutputStream(new FileOutputStream(tempFile))) {

            File folderToZip = new File(path);

            // Walk through files, folders & sub-folders.
            Files.walk(folderToZip.toPath()).forEach(p -> {
                File file = p.toFile();

                // Directory is not streamed, but its files are streamed into zip file with
                // folder in it's path
                if (!file.isDirectory()) {

                    ZipArchiveEntry entry_1 = new ZipArchiveEntry(file, file.toString());
                    try (FileInputStream fis = new FileInputStream(file)) {
                        archive.putArchiveEntry(entry_1);
                        IOUtils.copy(fis, archive);
                        archive.closeArchiveEntry();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });

            // Complete archive entry addition.
            archive.finish();
        } catch (IOException e) {
            log.warn("StorageServiceImpl RowMapper", new StorageException("error while creating arch temp zip file", e));
            return null;
        }

        return tempFile.getAbsolutePath();
    }
}
