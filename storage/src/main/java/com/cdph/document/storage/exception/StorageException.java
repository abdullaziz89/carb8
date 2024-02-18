package com.cdph.document.storage.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StorageException extends RuntimeException {

    static final Logger log = LoggerFactory.getLogger(StorageException.class);
    private static final long serialVersionUID = -3843473084540331376L;

    public StorageException(String message) {
        super(message);
    }

    public StorageException(Throwable cause) {
        super(cause);
        log.error("StorageException cause: "+ cause.getLocalizedMessage());
    }

    public StorageException(String message, Throwable cause) {
        super(message, cause);
        log.error("StorageException message", message, "cause", cause.getLocalizedMessage());
    }
}
