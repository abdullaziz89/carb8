package com.cdph.document.storage.model;

import org.jetbrains.annotations.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

public class BASE64DecodedMultipartFile implements MultipartFile {
    private final byte[] imgContent;

    private final String name;
    private String originalFilename;

    private String contentType;

    public BASE64DecodedMultipartFile(byte[] imgContent, String name) {
        this.imgContent = imgContent;
        this.name = name;
    }

    public BASE64DecodedMultipartFile(byte[] imgContent, String name, String originalFilename, String contentType) {
        this.imgContent = imgContent;
        this.name = name;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
    }

    @Override
    public @NotNull String getName() {
        return this.name;
    }

    @Override
    public String getOriginalFilename() {
        return this.originalFilename;
    }

    @Override
    public String getContentType() {
        return this.contentType;
    }

    @Override
    public boolean isEmpty() {
        return imgContent == null || imgContent.length == 0;
    }

    @Override
    public long getSize() {
        return imgContent.length;
    }

    @Override
    public byte @NotNull [] getBytes() throws IOException {
        return imgContent;
    }

    @Override
    public @NotNull InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(imgContent);
    }

    @Override
    public void transferTo(@NotNull File dest) throws IOException, IllegalStateException {
        new FileOutputStream(dest).write(imgContent);
    }
}

