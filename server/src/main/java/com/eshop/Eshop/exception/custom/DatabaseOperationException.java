package com.eshop.Eshop.exception.custom;

public class DatabaseOperationException extends RuntimeException {
  public DatabaseOperationException(String message) {
    super(message);
  }      
}
