package com.cdph.document.storage.exception;

public class StorageFileNotFoundException extends StorageException {

    private static final long serialVersionUID = 8443357637621650710L;

    public StorageFileNotFoundException(String message) {
        super(message);
    }

    public StorageFileNotFoundException(Throwable cause) {
        super(cause);
    }

    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
