package com.eshop.Eshop.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CustomerDTO {
      private String email;
      private String mobileNo;
}
