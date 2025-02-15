package com.eshop.Eshop.exception;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.eshop.Eshop.exception.custom.AuthenticationException;
import com.eshop.Eshop.exception.custom.DatabaseOperationException;
import com.eshop.Eshop.exception.custom.InvalidInputException;
import com.eshop.Eshop.exception.custom.InvalidJwtTokenException;
import com.eshop.Eshop.exception.custom.InvalidMobileNumberException;
import com.eshop.Eshop.exception.custom.InvalidOTPException;
import com.eshop.Eshop.exception.custom.MobileNumberNotVerifiedException;
import com.eshop.Eshop.exception.custom.ResourceNotFoundException;
import com.eshop.Eshop.exception.custom.UnprocessableEntityException;
import com.eshop.Eshop.exception.custom.UserAlreadyExistsException;

/**
 * Global exception handler for handling application-wide exceptions.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

      private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

      // Catch Authentication & Validation Exceptions (Grouped)
      @ExceptionHandler({ MobileNumberNotVerifiedException.class, InvalidMobileNumberException.class,
                  InvalidOTPException.class })
      public ResponseEntity<String> handleAuthValidationExceptions(RuntimeException ex) {
            logger.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
      }

      // Handle User Registration Exceptions (Grouped)
      @ExceptionHandler({ UserAlreadyExistsException.class })
      public ResponseEntity<String> handleUserAlreadyExists(UserAlreadyExistsException ex) {
            logger.warn("User registration error: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
      }

      // Handle validation Failed Exceptions
      @ExceptionHandler(MethodArgumentNotValidException.class)
      public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
            Map<String, String> errors = new HashMap<>();

            for (FieldError error : ex.getBindingResult().getFieldErrors()) {
                  errors.put(error.getField(), error.getDefaultMessage());
            }
            logger.warn("Validation error: {}", errors);
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
      }

      // Handle Illegal Argument Errors
      @ExceptionHandler(IllegalArgumentException.class)
      public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
            logger.warn("Invalid request: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                  .body("Invalid request: " + ex.getMessage());
      }

      // Handle Unexpected Errors (Catch-All)
      @ExceptionHandler(Exception.class)
      public ResponseEntity<String> handleGlobalException(Exception ex) {
            logger.error("Unexpected error: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An unexpected error occurred. Please try again later.");
      }

      // Handle Authentication Failures
      @ExceptionHandler({ AuthenticationException.class, InvalidJwtTokenException.class })
      public ResponseEntity<String> handleAuthenticationException(RuntimeException ex) {
            logger.warn("Authentication failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                  .body("Authentication failed: " + ex.getMessage());
      }

      // Handles cases where a requested resource is not found.
      @ExceptionHandler(ResourceNotFoundException.class)
      public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
            logger.warn("Resource not found: {}", ex.getMessage());
            Map<String, String> response = new HashMap<>();

            response.put("error", "Resource Not Found");
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
      }

      // Handling database operation failures.
      @ExceptionHandler(DatabaseOperationException.class)
      public ResponseEntity<Map<String, String>> handleDatabaseException(DatabaseOperationException ex) {
            logger.error("Database operation failed: {}", ex.getMessage());

            Map<String, String> response = new HashMap<>();
            response.put("error", "Database Error");
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Handle Invalid Inputs
      @ExceptionHandler(InvalidInputException.class)
      public ResponseEntity<Map<String, String>> handleInvalidInputException(InvalidInputException ex) {

            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid Input");
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
      }

      // Handle Unprocessable Entity Errors
      @ExceptionHandler(UnprocessableEntityException.class)
      public ResponseEntity<Map<String, String>> handleUnprocessableEntityException(UnprocessableEntityException ex) {

            logger.warn("Unprocessable entity: {}", ex.getMessage());

            Map<String, String> response = new HashMap<>();
            response.put("error", "Unprocessable Entity");
            response.put("message", ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
      }

}
