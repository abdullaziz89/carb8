package com.cdph.document.storage.config.property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.ResourceLoader;

@ConfigurationProperties(prefix = "document")
public class DocumentStorageProperty {

    @Autowired
    private ResourceLoader resourceLoader;

    private String uploadDirectory;

    public String getUploadDirectory() {
        return uploadDirectory;
    }

    public void setUploadDirectory(String uploadDirectory) {
        this.uploadDirectory = uploadDirectory;
    }
}
