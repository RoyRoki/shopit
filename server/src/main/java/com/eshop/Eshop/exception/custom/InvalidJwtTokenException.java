package com.eshop.Eshop.exception.custom;

public class InvalidJwtTokenException extends RuntimeException {
      public InvalidJwtTokenException(String message) {
            super(message);
      }
}
