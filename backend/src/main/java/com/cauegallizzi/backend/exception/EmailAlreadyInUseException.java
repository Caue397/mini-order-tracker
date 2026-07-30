package com.cauegallizzi.backend.exception;

public class EmailAlreadyInUseException extends RuntimeException {

    public EmailAlreadyInUseException(String email) {
        super("E-mail já está em uso: " + email);
    }
}
