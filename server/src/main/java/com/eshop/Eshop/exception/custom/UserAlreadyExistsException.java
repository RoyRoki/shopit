package com.eshop.Eshop.exception.custom;

public class UserAlreadyExistsException extends RuntimeException {
      public UserAlreadyExistsException(String message) {
            super(message);
      }
}
