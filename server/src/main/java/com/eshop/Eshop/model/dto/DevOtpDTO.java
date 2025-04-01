package com.eshop.Eshop.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DevOtpDTO {
      private String otp;
      private String message;
}
