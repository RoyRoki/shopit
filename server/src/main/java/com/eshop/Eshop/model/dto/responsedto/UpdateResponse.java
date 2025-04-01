package com.eshop.Eshop.model.dto.responsedto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateResponse<T> {
    private String message;
    private String updatedField;
    private T updatedValue;
}
